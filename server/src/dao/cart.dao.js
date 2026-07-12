import cartModel from "../models/cart.js"
import { buildCartStatsAggregation } from "../services/cartStats.service.js";


// Return cart with populated product and resolved variant object (if present).
// The aggregation now preserves cart items even when there is no matching
// variant, which avoids false out-of-stock states on the client.
export const getCartDetails = async (userId) => {
    const [cart] = await cartModel.aggregate(buildCartStatsAggregation(userId));

    if (!cart) return { items: [] };

    // Normalize items: attach the full variant object inside item.variant when present
    const items = (cart.items || []).map((item) => {
        const product = item.product || null;
        let variant = null;

        if (product && item.variant) {
            variant = (product.variants || []).find((v) => v._id?.toString() === item.variant?.toString()) || null;
        }

        const price = variant?.price || item.price || product?.price || null;
        const stock = variant?.stock ?? (product?.stock ?? Infinity);

        return {
            ...item,
            product,
            variant,
            price,
            stock
        };
    });

    const subtotal = items.reduce((s, it) => s + ((it.price?.amount || 0) * (it.quantity || 1)), 0);
    const currency = items[0]?.price?.currency || "INR";

    return {
        _id: cart._id,
        items,
        subtotal,
        currency,
        totalPrice: cart.totalPrice ?? subtotal
    };
};