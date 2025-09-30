import React from 'react'
import PaymentPage from '../../components/PaymentPage'
import { notFound } from 'next/navigation'
import User from '@/models/User'
import connectDB from '@/db/connectDb'

const Username = async ({ params }) => {

    const checkUser = async () => {
        await connectDB()
        let u = await User.findOne({ username: params.username})
        if (!u) {
            return notFound()
        }
    }
    await checkUser()

    return (
        <>
            <PaymentPage username={params?.username ?? " "} />
        </>
    )
}


export default Username

export async function generateMetadata({ params }) {
    return {
        title: `${params.username} - Get Me A Samosa`
    }
}