import api from "../../../services/api.baseurl";

export const getWishList = async () => {
    return await api.get('wishlist/get-your-choice').then(res => res.data)
}

export const addToWishlistApi = async (productId) => {
    return await api.post('wishlist', { productId }).then(res => res.data)
}

export const deleteWishList = async (id) => {
    return await api.delete(`wishlist/remove-from-list/${id}`).then(res => res.data)
}