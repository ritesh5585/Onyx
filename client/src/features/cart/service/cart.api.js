import api from '../../../services/api.baseurl.js'

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    return (await api.post(`cart/add/${productId}/${variantId}`, { quantity })).data
}

export const getCart = async () => {
    return (await api.get('/cart/get')).data
}

export const removeFromCart = async (cartItemId) => {
    return (await api.delete(`cart/remove/${cartItemId}`)).data
}

export const updateCartQty = async (cartItemId, quantity) => {
    return (await api.patch(`/cart/update/${cartItemId}`, { quantity })).data
}

export const createOrderPayment = async (amount, currency) => {
    return (await api.post('/payment/create/order')).data
}