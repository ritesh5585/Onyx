import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";
import { useCallback } from "react";
import {
    addToCart,
    createOrderPayment,
    getCart,
    removeFromCart,
    updateCartQty
} from "../service/cart.api";

export const useCart = () => {
    const dispatch = useDispatch();

    const refreshCart = useCallback(async () => {
        try {
            const data = await getCart();
            dispatch(setItems(data.cart));
            return data.cart;
        } catch (error) {
            console.error("Cart refresh failed", error);
            throw error;
        }
    }, [dispatch]);

    const handleAddtoCart = useCallback(async (productId, variantId) => {
        try {
            const data = await addToCart({ productId, variantId });
            await refreshCart();
            return data;
        } catch (error) {
            console.error("Cart not added", error);
            throw error;
        }
    }, [refreshCart]);

    const handleGetCart = useCallback(async () => {
        return refreshCart();
    }, [refreshCart]);

    const handleRemoveItem = useCallback(async (cartItemId) => {
        try {
            const data = await removeFromCart(cartItemId);
            await refreshCart();
            return data;
        } catch (error) {
            console.error("Failed to remove item:", error);
            throw error;
        }
    }, [refreshCart]);

    const handleIncrementQty = useCallback(async (cartItemId, currentQty) => {
        const newQty = currentQty + 1;

        try {
            const data = await updateCartQty(cartItemId, newQty);
            await refreshCart();
            return data;
        } catch (error) {
            console.error("Failed to increment quantity:", error);
            throw error;
        }
    }, [refreshCart]);

    const handleDecrementQty = useCallback(async (cartItemId, currentQty) => {
        const newQty = currentQty - 1;

        if (newQty <= 0) {
            return;
        }

        try {
            const data = await updateCartQty(cartItemId, newQty);
            await refreshCart();
            return data;
        } catch (error) {
            console.error("Failed to decrement quantity:", error);
            throw error;
        }
    }, [refreshCart]);

    const handleOrderPayment = useCallback(async (amount, currency) => {
        const data = await createOrderPayment()
        
        return data.orders
    }, [refreshCart])
    return {
        handleAddtoCart,
        handleGetCart,
        handleRemoveItem,
        handleIncrementQty,
        handleDecrementQty,
        handleOrderPayment
    };
};