import axios from 'axios'

const api = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export const addToCart = async ({ productId, variantId, quantity = 1 }) => {
    console.log("reached api")
    return await api.post(`/add/${productId}/${variantId}`, { quantity }).then(res => res.data)
}