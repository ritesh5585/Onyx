import cartModel from "../models/cart.js"

// Return cart with populated product and resolved variant object (if present).
// The previous aggregation unwound product.variants and required a matching
// variant; that caused items without a variant (or mismatched ids) to lose
// product/variant details and appear as out-of-stock on the client.
export const getCartDetails = async (userId) => {
    const cart = await cartModel.findOne({ user: userId }).populate('items.product').lean();

    if (!cart) return { items: [] };

    // Normalize items: attach the full variant object inside item.variant when present
    const items = (cart.items || []).map((item) => {
        const product = item.product || null;
        let variant = null;

        if (product && item.variant) {
            // product.variants is an array of subdocuments; find the matching one
            variant = (product.variants || []).find((v) => v._id.toString() === item.variant.toString()) || null;
        }

        // Ensure price object is present on item for backward compatibility
        const price = variant?.price || product?.price || null;

        // Determine stock: prefer variant.stock; if not present, fallback to Infinity
        // (products without variants are treated as having unlimited stock unless
        // you add a product-level stock field). This prevents false "Out of stock"
        // displays on the client.
        const stock = variant?.stock ?? (product?.stock ?? Infinity);

        return {
            ...item,
            product,
            variant,
            price,
            stock
        };
    });

    // Compute simple totals for client convenience
    const subtotal = items.reduce((s, it) => s + ((it.price?.amount || 0) * (it.quantity || 1)), 0);
    const currency = items[0]?.price?.currency || 'INR';

    return {
        _id: cart._id,
        items,
        subtotal,
        currency
    };
}