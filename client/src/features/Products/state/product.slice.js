import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        sellerProducts: [],
        products: [],
        details: null
    },
    reducers: {
        setSellerProduct: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setDetails: (state, action) => {
            state.details = action.payload
        }
    }
})

export const { setSellerProduct, setProducts, setDetails } = productSlice.actions
export default productSlice.reducer