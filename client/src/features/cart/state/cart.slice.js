import { createSlice } from "@reduxjs/toolkit";

const normalizeCart = (payload = {}) => ({
    _id: payload._id ?? null,
    items: Array.isArray(payload.items) ? payload.items : [],
    subtotal: payload.subtotal ?? 0,
    currency: payload.currency ?? "INR",
    totalPrice: payload.totalPrice ?? payload.subtotal ?? 0,
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: normalizeCart(),
    },
    reducers: {
        setItems: (state, action) => {
            state.items = normalizeCart(action.payload);
        },
        resetCart: (state) => {
            state.items = normalizeCart();
        },
    },
});

export const { setItems, resetCart } = cartSlice.actions;
export default cartSlice.reducer;