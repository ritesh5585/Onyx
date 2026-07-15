import axios from "axios";
import api from '../../../services/api.baseurl.js'
// const api = axios.create({
//     baseURL: "/api/auth",
//     withCredentials: true,
// });

export const parseError = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";

export const authApi = {
    register: (body) => api.post("auth/register", body)
        .then(res => res.data),

    login: (body) => api.post("auth/login", body)
        .then(res => res.data),

    logout: () => api.post("auth/logout")
        .then(res => res.data),

    me: () => api.get("auth/me")
        .then(res => res.data),
};