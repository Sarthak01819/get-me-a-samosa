"use client"

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Bounce } from 'react-toastify'
import { notFound } from 'next/navigation'

const PaymentPage = ({ username }) => {

    const [currentuser, setCurrentuser] = useState(null)
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams()
    const { data: session } = useSession()

    // initialize the whole form with safe default strings so inputs are always controlled
    const [paymentform, setPaymentform] = useState(() => ({
        name: username ?? '',
        message: '',
        amount: ''
    }))

    const getData = async () => {
        let u = await fetchuser(username)
        setCurrentuser(u || {})
        let dbpayments = await fetchpayments(username)
        setPayments(dbpayments || [])
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true") {
            toast.success('Thanks for your donation!', { // Use toast.success for better visual
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
    }, [searchParams])

    // keep form.name in sync if username prop changes
    useEffect(() => {
        setPaymentform(prev => ({ ...prev, name: username ?? '' }))
    }, [username])

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const pay = async (amount) => {
        // call server to create an order and return its id (shape may vary)
        const res = await initiate(amount, username, paymentform)

        // support several possible response shapes
        const orderId = res?.id || res?.orderId || res?.order_id || res

        const options = {
            "key": currentuser?.razorpayid || "", // Enter the Key ID generated from the Dashboard
            "amount": amount,
            "currency": "INR",
            "name": "Get Me A Samosa",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId,
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": {
                "name": paymentform.name || "",
                "email": "gaurav.kumar@example.com",
                "contact": "+919876543210"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        // ensure Razorpay SDK is loaded and available on window
        if (typeof window !== "undefined" && window.Razorpay) {
            const rzp1 = new window.Razorpay(options)
            rzp1.open()
        } else {
            console.error("Razorpay SDK not available")
        }
    }

    if (!currentuser) {
        return <div className="text-white text-center mt-10">Loading user data...</div>
    }

    // If the username is not present in the database, show a 404 page

    return (
        <>
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
                transition={Bounce} 
            />

            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='cover relative'>
                <img src={currentuser?.coverpic || "/default-cover.png"} alt="cover" className='lg:w-full w-[100vw] sm:h-auto h-[30vh] object-cover' />
                <div className='pfp h-26 w-26 mt-3 absolute top-5/6 right-1/2 translate-x-1/2 -bottom-14 border-2 border-white rounded-full overflow-hidden'>
                    <img className='h-26 w-26' src={currentuser?.profilepic || "/default-pfp.png"} alt="pfp" />
                </div>
            </div>
            <div className="info flex flex-col items-center justify-center xl:mt-14 mt-24 mb-10 gap-3">
                <span className='text-2xl font-bold'>@{username}</span>
                <span className='text-slate-400'>Creating Animated art for VTT's</span>
                <span className='text-slate-400'>{payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0) / 100} raised</span>
            </div>
            <div className="payment flex gap-3 w-[80%] mx-auto sm:h-[70vh] h-auto sm:flex-row flex-col pb-32">
                <div className="supporters w-full sm:w-1/2 bg-slate-900 rounded-xl pl-4 text-white">
                    <h2 className='font-bold text-2xl my-6'>Top 10 Supporters</h2>
                    <ul className='mx-4 list-inside space-y-2 overflow-y-scroll h-[35vh] text-lg '>
                        {payments.length === 0 && <li className='text-center text-xl font-bold'>No supporters yet. Be the first one!</li>}
                        {payments.map((p, i) => {
                            const key = p?._id ?? p?.oid ?? p?.id ?? i
                            return (
                                <li key={key} className='flex items-center gap-3 pr-4'>
                                    <div className='relative bg-slate-500 rounded-full h-8 w-8 flex items-center justify-center pb-0.5'>
                                        <img className='h-6' src="/user-avatar.gif" alt="user avatar" />
                                    </div>
                                    <span className='w-[90%]'>{p?.name || "Anonymous"} donates <span className='font-bold'>₹{(p?.amount || 0) / 100}</span> {p?.message && <>with a message <span className='font-bold'>"{p.message}"</span>.</>}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="makepayment sm:w-1/2 bg-slate-900 rounded-xl px-4 text-white w-full sm:mx-4">
                    <h2 className='font-bold text-2xl my-6'>Make a payment</h2>
                    <form className='flex flex-col gap-5' onSubmit={(e) => e.preventDefault()}>
                        <input type="text" onChange={handleChange} value={paymentform.name} name="name" placeholder='Enter your name' className='bg-slate-800 rounded-md p-2 outline-none' />
                        <input type="text" onChange={handleChange} value={paymentform.message} name="message" placeholder='Enter your message' className='bg-slate-800 rounded-md p-2 outline-none' />
                        <input type="number" onChange={handleChange} value={paymentform.amount} name="amount" placeholder='Enter amount in USD' className='bg-slate-800 rounded-md p-2 outline-none' />
                        <button onClick={() => pay(paymentform.amount * 100 || 0)} className='bg-blue-600 rounded-md p-2 hover:bg-blue-700 transition'>Pay</button>
                    </form>
                    <div className="presetamounts flex sm:flex-row flex-wrap gap-3 mt-5">
                        <button className='bg-slate-800 rounded-md p-2 hover:bg-slate-700 transition max-w-14' onClick={() => pay(500)}>₹5</button>
                        <button className='bg-slate-800 rounded-md p-2 hover:bg-slate-700 transition max-w-14' onClick={() => pay(1000)}>₹10</button>
                        <button className='bg-slate-800 rounded-md p-2 hover:bg-slate-700 transition max-w-14' onClick={() => pay(2000)}>₹20</button>
                        <button className='bg-slate-800 rounded-md p-2 hover:bg-slate-700 transition max-w-14' onClick={() => pay(5000)}>₹50</button>
                        <button className='bg-slate-800 rounded-md p-2 hover:bg-slate-700 transition max-w-14' onClick={() => pay(10000)}>₹100</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PaymentPage