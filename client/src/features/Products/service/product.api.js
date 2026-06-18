import axios from 'axios'

const api = axios.create({
    baseURL: '/api/product',
    withCredentials: true
})

export const createProduct = async (formData) => {
    await api.post('/', formData).then(res => res.data)
}
export const getSellerProduct = async () => {
    await api.get('/seller').then(res => res.data)
}

export const getAllproducts = async () => {
    await api.get('/', formData).then(res => res.data)
}