import productModel from '../models/product.js'
import cartModel from '../models/cart.js';

export const getProductVariant = async (productId, variantId) => {
    const product = await productModel.findById(productId)

    if (!product) throw new Error("productId not found");

    let variant = product.variants.find(
        el => el._id.toString() == variantId
    )

    if (!variant) throw new Error('variantId not found')

    return { product, variant }

}

export const findOrCreateCart = async (userId) => {
    let cart = await cartModel.findOne({ user: userId })

    if (!cart) {
        cart = await cartModel.create({
            user: userId,
            items: []
        })
    }
    return cart
}

