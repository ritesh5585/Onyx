import mongoose from "mongoose";
import priceSchema from "./price.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        trim: true,
        default: 'Accessories'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price: {
        type: priceSchema,
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            fileId: {
                type: String
            }
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    },
                    fileId: {
                        type: String
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema
            }
        }
    ]


}, { timestamps: true })

productSchema.index({ title: 'text', description: 'text', category: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ 'price.amount': 1 })

const productModel = mongoose.model('Product', productSchema)

export default productModel