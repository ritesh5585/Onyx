import { createPayment } from "../services/payment.service.js"
import cartModel from '../models/cart.js'
import paymentModel from '../models/payment.js'

export const createOrderPayment = async (req, res) => {
    const cart = await getCartDetails(req.user._id)

    if (!cart) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const orders = await createPayment({
        amount: cart.totalPrice,
        currency: cart.currency

    })


    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity,
            images: item.product.variants.images || item.product.images,
            description: item.product.description,
            price: {
                amount: item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })



    return res.status(200).json({
        message: 'Order payment successfull',
        orders
    })
}

export const verifyPayment = async () => {
   
}   