import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        sellerProducts: [],
        products: [],
        details: null,
        categories: [],
        filters: {
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest'
        }
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
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        resetFilters: (state) => {
            state.filters = {
                search: '',
                category: 'All',
                minPrice: '',
                maxPrice: '',
                sortBy: 'newest'
            }
        }
    }
})

export const { setSellerProduct, setProducts, setDetails, setCategories, setFilters, resetFilters } = productSlice.actions
export default productSlice.reducer