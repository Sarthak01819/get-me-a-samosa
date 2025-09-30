"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
    await connectDB()
    // use server-side env vars (KEY_ID/KEY_SECRET) — NEXT_PUBLIC_ vars are for client
    var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })

    instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })
    let options = {
        amount: Number.parseInt(amount) ,
        currency: "INR",
    }
    let x = await instance.orders.create(options)

    // Create a payment option which shows a pending payment in the dashboard
    await Payment.create({oid: x.id, amount: amount, to_user: to_username, name: paymentform.name, message: paymentform.message})

    return x 
}

export const fetchuser = async (username) => {
    await connectDB()
    // use lean() to get plain JS object, then ensure full serialization
    const u = await User.findOne({ username }).lean()
    return JSON.parse(JSON.stringify(u))
}

export const fetchpayments = async (username) => {
    await connectDB()
    // use lean() so Mongoose doesn't return full documents, then serialize
    const p = await Payment.find({ to_user: username, done:true }).sort({ amount: -1 }).limit(10).lean()
    return JSON.parse(JSON.stringify(p))
}

export const updateProfile = async (data, oldusername) => {
    await connectDB()

    // handle both FormData and plain object
    let ndata = data instanceof FormData ? Object.fromEntries(data.entries()) : data
    console.log(ndata)

    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })
        if (u) {
            return { error: "User already exists!" }
        }
        await User.updateOne({ email: ndata.email }, ndata)
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username })
    } else {
        await User.updateOne({ email: ndata.email }, ndata)
    }
}
