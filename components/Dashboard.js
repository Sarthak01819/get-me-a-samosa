"use client"

import React, { useEffect, useState, useCallback } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Bounce } from 'react-toastify'

const Dashboard = () => {
    const router = useRouter()
    const { data: session, status, update } = useSession()
    const [form, setform] = useState({})

    const getData = useCallback(async () => {
        if (!session?.user?.name) return
        const u = await fetchuser(session.user.name)
        setform(u ?? {})
    }, [session?.user?.name])

    useEffect(() => {
        // redirect unauthenticated users
        if (status === 'unauthenticated') {
            router.push("/login")
            return
        }

        // only fetch data when session is ready and authenticated
        if (status === 'authenticated' && session?.user?.name) {
            getData()
        }
    }, [status, router, getData, session?.user?.name])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // convert FormData -> plain object so server can read it
        const fd = new FormData(e.target)
        const plain = Object.fromEntries(fd)

        // call the server action with a plain object
        const updated = await updateProfile(plain, session.user.name)
        // update local state so UI reflects changes immediately
        if (updated) {
            setform(updated)
        } else {
            // if server returned null, re-fetch or inform user
            await getData()
        }
        update() // refresh next-auth session if needed
        toast('Details updated!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

    }

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" 
                />
            
            <h1 className='font-bold text-3xl text-center py-8'>Welcome to your Dashboard</h1>
            <form className="sm:max-w-[50%] max-w-[100%] px-8 mx-auto" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input name="name" id="name-input" type="text" value={form.name ? form.name : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="email-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input name="email" id="email-input" type="email" value={form.email ? form.email : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="username-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input name="username" id="username-input" type="text" value={form.username ? form.username : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="profilepic-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
                    <input name="profilepic" id="profilepic-input" type="text" value={form.profilepic ? form.profilepic : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="coverpic-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Cover Picture</label>
                    <input name="coverpic" id="coverpic-input" type="text" value={form.coverpic ? form.coverpic : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="razorpayid-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay ID</label>
                    {/* name matches schema field razorpayid (lowercase) */}
                    <input name="razorpayid" id="razorpayid-input" type="text" value={form.razorpayid ? form.razorpayid : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="razorpaysecret-input" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Secret</label>
                    {/* name matches schema field razorpaysecret (lowercase) */}
                    <input name="razorpaysecret" id="razorpaysecret-input" type="text" value={form.razorpaysecret ? form.razorpaysecret : ""} onChange={handleChange} className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <button className='bg-blue-600 rounded-lg p-2 w-full my-6 hover:bg-blue-700 transition font-bold'>Save</button>
            </form>
        </div>
    )
}

export default Dashboard