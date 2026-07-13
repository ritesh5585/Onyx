import Razorpay from 'razorpay'
import { config } from '../config/config.js'

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_ID,
    key_secret: config.RAZORPAY_SECRET
})

export const createPayment = async ({ amount, currency = 'INR' }) => {
    const options = {
        amount: amount * 100, // RazorPay paise mein leta hai
        currency
    }
    const order = await razorpay.orders.create(options)
    return order
}


