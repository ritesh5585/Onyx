import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.state'
import productReducer from "../features/Products/state/product.slice"
import cartReducer from "../features/cart/state/cart.slice"
import wishlistReducer from "../features/Wishlists/state/wishlist.slice"
import orderReducer from "../features/orders/state/order.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        order: orderReducer
    }
})