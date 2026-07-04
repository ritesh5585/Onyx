import axios from 'axios'

const api = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    return await api.post(`/add/${productId}/${variantId}`, { quantity }).then(res => res.data)
}
export const getCart = async () => {
    return await api.get('/get').then(res => res.data)
}