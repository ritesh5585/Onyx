import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItems: (state, action) => {
            state.items.push(action.payload)
        },
        removeItems: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload)
        },
        updateItemQty: (state, action) => {
            const { cartItemId, quantity } = action.payload;
            const item = state.items.find(i => i._id === cartItemId);
            if (item) item.quantity = quantity;
        }
    }
})

export const { setItems, addItems, removeItems, updateItemQty } = cartSlice.actions
export default cartSlice.reducer