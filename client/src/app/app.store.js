import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.state'
import productReducer from "../features/Products/state/product.slice"
import cartReducer from "../features/cart/state/cart.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer
    }
})