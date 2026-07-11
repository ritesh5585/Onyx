import { addToCart, getCart, removeFromCart, updateCartQty } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems, removeItems, updateItemQty } from "../state/cart.slice";
import { useCallback } from "react";

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddtoCart = useCallback(async (productId, variantId) => {
        try {
            const data = await addToCart({ productId, variantId });
            dispatch(setItems(data.cart.items));
            return data;
        } catch (error) {
            console.error("cart not added", error);
            throw error;
        }
    }, [dispatch]);

    const handleGetCart = useCallback(async () => {
        try {
            const data = await getCart();
            dispatch(setItems(data.cart.items));
        } catch (error) {
            console.error("cart not found", error);
            throw error;
        }
    }, [dispatch]);

    const handleRemoveItem = useCallback(async (cartItemId) => {
        try {
            const data = await removeFromCart(cartItemId);
            dispatch(removeItems(cartItemId));
            return data;
        } catch (error) {
            console.error("Failed to remove item:", error);
            throw error;
        }
    }, [dispatch]);

    const handleIncrementQty = useCallback(async (cartItemId, currentQty) => {
        const newQty = currentQty + 1;

        try {
            const data = await updateCartQty(cartItemId, newQty);
            dispatch(updateItemQty({ cartItemId, quantity: newQty }));
            return data;
        } catch (error) {
            console.error("Failed to increment quantity:", error);
            throw error;
        }
    }, [dispatch]);

    const handleDecrementQty = useCallback(async (cartItemId, currentQty) => {
        const newQty = currentQty - 1;

        if (newQty <= 0) {
            return;
        }

        try {
            const data = await updateCartQty(cartItemId, newQty);
            dispatch(updateItemQty({ cartItemId, quantity: newQty }));
            return data;
        } catch (error) {
            console.error("Failed to decrement quantity:", error);
            throw error;
        }
    }, [dispatch]);

    return {
        handleAddtoCart,
        handleGetCart,
        handleRemoveItem,
        handleIncrementQty,
        handleDecrementQty
    };
};