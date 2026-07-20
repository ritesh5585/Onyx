import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlist: []
    },
    reducers: {
        setWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
        addToWishlist: (state, action) => {
            const product = action.payload;
            state.wishlist.push(product);
        },
        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(item => item._id !== action.payload);
        }
    }
});

export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;