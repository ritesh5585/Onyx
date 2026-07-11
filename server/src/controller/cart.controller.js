import cartModel from '../models/cart.js'
import { findOrCreateCart, getProductVariant } from '../dao/product.dao.js'
import { getCartDetails } from '../dao/cart.dao.js';

export async function addToCart(req, res) {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    try {
        const productData = await getProductVariant(productId, variantId);
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product or variant not found"

            });
        }

        const { product, variant } = productData;
        const currentStock = variant?.stock ?? product.stock ?? Infinity;
        const currentPrice = variant?.price ?? product.price;

        if (quantity > currentStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${currentStock} stocks left`
            });
        }


        const cart = await findOrCreateCart(userId);

        const validVariantId = (
            variantId && variantId !== "null" &&
            variantId !== "undefined"
        ) ? variantId : null;

        const existingItem = cart.items.find(item =>
            item.product.toString() === productId &&
            (validVariantId ? item.variant?.toString() === validVariantId : !item.variant)
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > currentStock) {
                return res.status(400).json({
                    success: false,
                    message: "Stock exceeded"

                });
            }
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                product: productId,
                quantity,
                price: currentPrice

            };
            if (validVariantId) newItem.variant = validVariantId;

            cart.items.push(newItem);
        }

        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Added to cart",
            cart

        });

    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            success: false
            , message: error.message || "Internal server error"

        });
    }
}

export async function viewCartProduct(req, res) {   
    try {
        const userId = req.user._id;
        const cart = await getCartDetails(userId);

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("View cart error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

export async function removeFromCart(req, res) {
    const { cartItemId } = req.params;
    const userId = req.user._id;

    try {
        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== cartItemId);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart
        });
    } catch (error) {
        console.error("Remove cart item error:", error);
        return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

export async function updateCartItemQuantity(req, res) {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    try {
        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"

            });
        }

        const item = cart.items.id(cartItemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"

            });
        }

        if (typeof quantity !== "number" || Number.isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"

            });
        }

        const productData = await getProductVariant(item.product.toString(), item.variant ? item.variant.toString() : null);
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product or variant not found"

            });
        }

        const { product, variant } = productData;
        const currentStock = variant?.stock ?? product.stock ?? Infinity;

        if (quantity > currentStock) {
            return res.status(400).json({
                success: false,
                message: `Only ${currentStock} stocks left`
            });
        }

        item.quantity = quantity;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart
        });
    } catch (error) {
        console.error("Update cart item quantity error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}