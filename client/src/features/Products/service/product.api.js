import axios from 'axios'
import api from '../../../services/api.baseurl.js'

// const api = axios.create({
//     baseURL: '/api/product',
//     withCredentials: true
// })

export const createProduct = async (formData) => {
    return await api.post('product/', formData).then(res => res.data)
}
export const getSellerProduct = async () => {
    return await api.get('product/seller').then(res => res.data)
}

export const getAllproducts = async () => {
    return await api.get('product/').then(res => res.data)
}

export const getProductDetail = async (productId) => {
    return await api.get(`product/${productId}`).then(res => res.data)
}

export const addProductvariants = async (productId, variants) => {
    return await api.post(`product/${productId}/variants`, { variants }).then(res => res.data)
}

export const updateProductInfo = async (productId, payload) => {
    return await api.patch(`product/${productId}`, payload).then(res => res.data)
}

export const deleteProduct = async (productId) => {
    return await api.delete(`product/product-deleting/${productId}`).then(res => res.data)
}

export const deleteProductVariant = async (productId, variantId) => {
    return await api.delete(`product/product-deleting/${productId}/variants/${variantId}`).then(res => res.data)
}
