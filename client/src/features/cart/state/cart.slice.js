import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    cart: "cart",
    initialState: {
        items: []
    },
    reducers: {
        setItems: (state, action) => {
            state.items = payload.action
        },
        addItems: (state, action) => {
            state.items = payload.action
        }
    }
})

const { setItems, addItems } = createSlice.actions
export default createSlice.reducer