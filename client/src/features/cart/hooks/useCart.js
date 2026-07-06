import { addToCart, getCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";
import { useCallback } from "react";

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddtoCart = useCallback(async (productId, variantId) => {
        try {
            const data = await addToCart({ productId, variantId });
            return data;
        } catch (error) {
            console.error("cart not added", error);
            throw error;
        }
    }, []);

    const handleGetCart = useCallback(async () => {
        try {
            const data = await getCart();
            dispatch(setItems(data.cart.items));
        } catch (error) {
            console.error("cart not found", error);
            throw error;
        }
    }, [dispatch]);

    return { handleAddtoCart, handleGetCart };
};