import axios from 'axios'

const api = axios.create({
    baseURL: '/api/product',
    withCredentials: true
})

export const createProduct = async (formData) => {
    return await api.post('/', formData).then(res => res.data)
}
export const getSellerProduct = async () => {
    return await api.get('/seller').then(res => res.data)
}

export const getAllproducts = async () => {
    return await api.get('/').then(res => res.data)
}

export const getProductDetail = async (productId) => {
    return await api.get(`/${productId}`).then(res => res.data)
}

export const addProductvariants = async (productId, variants) => {
    return await api.post(`/${productId}/variants`, { variants }).then(res => res.data)
}

export const updateProductInfo = async (productId, payload) => {
    return await api.patch(`/${productId}`, payload).then(res => res.data)
}

export const deleteProduct = async (productId) => {
    return await api.delete(`/product-deleting/${productId}`).then(res => res.data)
}

export const deleteProductVariant = async (productId, variantId) => {
    return await api.delete(`/product-deleting/${productId}/variants/${variantId}`).then(res => res.data)
}
