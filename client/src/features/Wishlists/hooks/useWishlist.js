import { useCallback } from 'react'
import { getWishList, addToWishlistApi, deleteWishList } from '../service/wishliist.api'
import { setWishlist, addToWishlist, removeFromWishlist } from '../state/wishlist.slice'
import { useDispatch } from 'react-redux'

export const useWishlist = () => {
    const dispatch = useDispatch()

    const handleGetWishlist = useCallback(async () => {
        try {
            const data = await getWishList()
            dispatch(setWishlist(data?.wishlist || []))
            return data
        } catch (error) {
            console.error("get wishlist failed:", error);
            throw error;
        }
    }, [dispatch])

    const handleAddToWishlist = useCallback(async (productId) => {
        try {
            const data = await addToWishlistApi(productId)
            if (data?.wishlistItem) {
                dispatch(addToWishlist(data.wishlistItem))
            }
            return data
        } catch (error) {
            console.error("add to wishlist failed:", error);
            throw error;
        }
    }, [dispatch])

    const handleDeleteWishlist = useCallback(async (id) => {
        try {
            const data = await deleteWishList(id)
            if (data?.success) {
                dispatch(removeFromWishlist(id))
            }
            return data
        } catch (error) {
            console.error("delete wishlist failed:", error);
            throw error;
        }
    }, [dispatch])

    return {
        handleGetWishlist,
        handleAddToWishlist,
        handleDeleteWishlist
    }
}