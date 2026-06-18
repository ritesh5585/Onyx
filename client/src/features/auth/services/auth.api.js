import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

export const parseError = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong";

export const authApi = {
    register: (body) => api.post("/register", body).then(res => res.data),
    login: (body) => api.post("/login", body).then(res => res.data),
    logout: () => api.post("/logout").then(res => res.data),
    // me: () => api.get("/me").then(res => res.data),
};