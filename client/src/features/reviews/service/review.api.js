// Layer 1: Service — raw API calls
import api from '../../../services/api.baseurl.js';

export const submitReview = async (productId, data) => {
  return (await api.post(`/review/${productId}`, data)).data;
};

export const fetchProductReviews = async (productId) => {
  return (await api.get(`/review/${productId}`)).data;
};

export const fetchMyReview = async (productId) => {
  return (await api.get(`/review/${productId}/mine`)).data;
};

export const removeReview = async (reviewId) => {
  return (await api.delete(`/review/${reviewId}`)).data;
};

// DEV-ONLY: Manually update order status
export const devUpdateOrderStatus = async (orderId, status) => {
  return (await api.patch(`/order/${orderId}/status`, { status })).data;
};
