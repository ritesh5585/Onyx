import { setUser, setLoading, setError } from '../state/auth.state.js'
import { register, login } from '../services/auth.api.js'
import { useDispatch } from 'react-redux'

export const useAuth = () => {

    const dispatch = useDispatch()

    const handleRegister = async ({ fullname, email, contact, password, isSeller = false }) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await register({ fullname, email, contact, password, isSeller })

            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            const message = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || 'Registration failed'

            dispatch(setError(message))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async ({ email, password }) => {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await login({ email, password })

            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            const message = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || 'Login failed'

            dispatch(setError(message))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin }
}