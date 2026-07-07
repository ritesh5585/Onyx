import axios from 'axios'

const api = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    return (await api.post(`/add/${productId}/${variantId}`, { quantity })).data
}

export const getCart = async () => {
    return (await api.get('/get')).data
}

export const removeFromCart = async (cartItemId) => {
    return (await api.delete(`/remove/${cartItemId}`)).data
}

export const updateCartQty = async (cartItemId, quantity) => {
    return (await api.patch(`/update/${cartItemId}`, { quantity })).data
}