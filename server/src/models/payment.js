import mongoose from "mongoose";
import priceSchema from "./price.js";


const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    price: {
        type: priceSchema,
        required: true
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    shippingAddress: {
        name: String,
        phone: String,
        alternativePhone: String,
        email: String,
        addressLine: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    orderItems: [
        {
            title: String,
            productId: mongoose.Schema.Types.ObjectId,
            variantId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            images: [{ url: String }],
            description: String,
            price: priceSchema
        }
    ]
})


const paymentModel = mongoose.model("payment", paymentSchema)

export default paymentModel;