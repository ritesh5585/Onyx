import axios from 'axios'

const authApiInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true
})

export async function register({ email, contact, password, fullname, isSeller }) {
    const respone = await authApiInstance.post('/register', {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return respone.data
}

export async function login({ email, password }) {
    const respone = await authApiInstance.post('/login', {
        email,
        password
    })

    return respone.data
}