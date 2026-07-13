import { createPayment } from "../services/payment.service.js"
import cartModel from '../models/cart.js'

export const createOrderPayment = async (requestAnimationFrame, res) => {

    const orders = await createPayment({ amount: 1000, currency: 'INR' })

    return res.status(200).json({
        message: 'Order payment successfull',
        orders
    })
}
