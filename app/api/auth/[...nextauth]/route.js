import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import mongoose from 'mongoose';
import User from '@/models/User';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDb';
// import { MongoClient } from 'mongodb';

// Connect to the database
export const authoptions = NextAuth({
    providers: [
        // OAuth authentication providers...
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            // Ask GitHub to return the user's email (primary/verified) when possible
            authorization: { params: { scope: "read:user user:email" } }
        }),
        // AppleProvider({
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET
        // }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET
        // }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_ID,
        //     clientSecret: process.env.GOOGLE_SECRET
        // }),
        // // Passwordless / email sign in
        // EmailProvider({
        //     server: process.env.MAIL_SERVER,
        //     from: 'NextAuth.js <no-reply@example.com>'
        // }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // only run this DB logic for GitHub sign-ins
            if (account?.provider === "github") {
                // ensure DB connection
                await connectDB();

                // GitHub may return email in different places; pick the first available
                const userEmail =
                    user?.email ||
                    profile?.email ||
                    (email && (email.value || email)) ||
                    (profile?.emails && profile.emails[0]?.value);

                // if we couldn't resolve an email, prevent sign in (or handle as you prefer)
                if (!userEmail) return false;

                // Check if the user already exists in the database
                const currentUser = await User.findOne({ email: userEmail });
                if (!currentUser) {
                    // If not, create a new user
                    const usernameFromEmail = userEmail.split("@")[0];
                    const newUser = new User({
                        email: userEmail,
                        // prefer display name if available, otherwise derive from email
                        username: user?.name ? user.name.replace(/\s+/g, "") : usernameFromEmail,
                    });
                    await newUser.save()
                }
                
                return true;
            }

            // For other providers allow sign in by default
            return true;
        },
        async session({ session, user, token }) {
            // guard against missing session or email
            if (!session?.user?.email) return session;

            await connectDB();
            const dbUser = await User.findOne({ email: session.user.email });

            // if DB user exists, set the session name from DB (avoid crashing if dbUser is null)
            if (dbUser) session.user.name = dbUser.username;
            return session
        },
    },
})

export { authoptions as GET, authoptions as POST }