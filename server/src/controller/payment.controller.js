import crypto from "node:crypto"
import { createPayment } from "../services/payment.service.js"
import paymentModel from '../models/payment.js'
import { getCartDetails } from "../dao/cart.dao.js"
import addressModel from "../models/address.js"

export const createOrderPayment = async (req, res) => {
    try {
        const { addressId } = req.body
        const cart = await getCartDetails(req.user._id)

        if (!cart.items.length) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false
            })
        }

        let shippingAddress = null
        if (addressId) {
            const addr = await addressModel.findOne({ _id: addressId, user: req.user._id })
            if (addr) {
                shippingAddress = {
                    name: addr.name,
                    phone: addr.phone,
                    alternativePhone: addr.alternativePhone || "",
                    email: addr.email || "",
                    addressLine: addr.addressLine,
                    city: addr.city,
                    state: addr.state,
                    zip: addr.zip,
                    country: addr.country
                }
            }
        }

        const order = await createPayment({    // ← FIX: "orders" → "order"
            amount: cart.totalPrice,
            currency: cart.currency
        })
        const payment = await paymentModel.create({
            user: req.user._id,
            shippingAddress,
            razorpay: {
                orderId: order.id,    // ✅ Ab sahi hai
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
                images: item.product.variants?.images || item.product.images,
                description: item.product.description,
                price: {
                    amount: item.product.variants?.price?.amount || item.product.price.amount,
                    currency: item.product.variants?.price?.currency || item.product.price.currency
                }
            }))
        })

        return res.status(200).json({
            message: 'Payment order created',
            order,
            payment,
            success: true
        })

    } catch (error) {
        console.error('Message:', error.message)
        console.error('Stack:', error.stack)

        return res.status(500).json({
            message: error.message || 'Payment creation failed',
            success: false
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature
        } = req.body

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({ message: "Incomplete payment details", success: false })
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex")

        const signaturesMatch = signature.length === expectedSignature.length &&
            crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))

        if (!signaturesMatch) {
            return res.status(400).json({ message: "Invalid payment signature", success: false })
        }

        const payment = await paymentModel.findOneAndUpdate(
            { user: req.user._id, "razorpay.orderId": orderId, status: "pending" },
            {
                $set: {
                    status: "paid",
                    "razorpay.paymentId": paymentId,
                    "razorpay.signature": signature
                }
            },
            { new: true }
        )

        if (!payment) {
            return res.status(404).json({ message: "Payment order not found", success: false })
        }

        return res.status(200).json({ message: "Payment verified", payment, success: true })
    } catch (error) {
        console.error("Payment verification failed:", error)
        return res.status(500).json({ message: "Payment verification failed", success: false })
    }
}