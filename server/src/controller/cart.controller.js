import cartModel from '../models/cart.js'
import { findOrCreateCart, getProductVariant } from '../dao/product.dao.js'
import { getCartDetails } from '../dao/cart.dao.js';

export async function addToCart(req, res) {
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body
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

        if (quantity > variant.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock} stocks left`
            });
        }


        const cart = await findOrCreateCart(userId);

        const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        if (existingItem) {
            if (existingItem.quantity + quantity > variant.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Stock exceeded"
                });
            }

            existingItem.quantity += quantity;
        } else {
            console.log({
                variantPrice: variant.price,
                productPrice: product.price
            })

            cart.items.push({
                product: productId,
                variant: variantId,
                quantity,
                price: variant?.price || product?.price
            });
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
            success: false,
            message: error.message || "Internal server error"
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