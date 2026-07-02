import cartModel from '../models/cart.js'
import { findOrCreateCart, getProductVariant } from '../dao/cart.dao.js'

export async function addToCart(req, res) {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await getProductVariant(productId, variantId);

    if (!product) {
        throw new Error("Product or variant not found");
    }

    const { product, variant } = product;

    if (quantity > variant.stock) {
        throw new Error(`Only ${variant.stock} stocks left`);
    }

    const cart = await findOrCreateCart(userId);

    const existingItem = cart.items.find(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );

    if (existingItem) {
        if (existingItem.quantity + quantity > variant.stock) {
            throw new Error("Stock exceeded");
        }

        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            variant: variantId,
            quantity,
            price: product.price
        });
    }

    await cart.save();

    return { success: true, message: "Added to cart" };
}