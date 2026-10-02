import api from '../../../services/api.baseurl.js';

export const createOrder = async (orderData) => {
    return (await api.post('/order', orderData)).data;
};

export const getMyOrders = async () => {
    return (await api.get('/order')).data;
};

export const getOrderById = async (orderId) => {
    return (await api.get(`/order/${orderId}`)).data;
};

export const cancelOrder = async (orderId) => {
    return (await api.patch(`/order/${orderId}/cancel`)).data;
};
