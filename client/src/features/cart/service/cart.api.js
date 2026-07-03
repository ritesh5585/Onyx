import axios from 'axios'

const api = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async ({ productId, variantId }) => {
    return await api.post(`/add/:${productId}/:${variantId}`).then(res => res.data)
}