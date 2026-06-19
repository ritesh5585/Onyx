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
