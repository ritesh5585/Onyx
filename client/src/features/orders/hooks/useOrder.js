import { useDispatch, useSelector } from "react-redux";
import { setOrders, addOrder, updateOrder, setLoading, setError } from "../state/order.slice";
import { useCallback } from "react";
import { getMyOrders, createOrder, cancelOrder, getOrderById } from "../service/order.api";

export const useOrder = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, error } = useSelector((state) => state.order);

    const fetchMyOrders = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getMyOrders();
            if (data.success) {
                dispatch(setOrders(data.orders));
            }
            return data.orders;
        } catch (err) {
            console.error("Failed to fetch orders", err);
            dispatch(setError(err.response?.data?.message || err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCreateOrder = useCallback(async (orderData) => {
        try {
            const data = await createOrder(orderData);
            if (data.success && data.order) {
                dispatch(addOrder(data.order));
            }
            return data;
        } catch (err) {
            console.error("Order creation failed", err);
            throw err;
        }
    }, [dispatch]);

    const handleCancelOrder = useCallback(async (orderId) => {
        try {
            const data = await cancelOrder(orderId);
            if (data.success && data.order) {
                dispatch(updateOrder(data.order));
            }
            return data;
        } catch (err) {
            console.error("Failed to cancel order", err);
            throw err;
        }
    }, [dispatch]);

    return {
        orders,
        isLoading,
        error,
        fetchMyOrders,
        handleCreateOrder,
        handleCancelOrder
    };
};
