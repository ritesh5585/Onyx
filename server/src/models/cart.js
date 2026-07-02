import mongoose from "mongoose";
import priceSchema from "./price.js";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product.variants"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model('carts', cartSchema)
export default  cartModel