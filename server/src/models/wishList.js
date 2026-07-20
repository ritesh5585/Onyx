import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
})

const wishListModel = mongoose.model("wishList", wishListSchema)
export default wishListModel