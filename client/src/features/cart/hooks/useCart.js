import { addToCart, getCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItems, setItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddtoCart(productId, variantId) {
        try {
            const data = await addToCart({ productId, variantId });
            return data;
        } catch (error) {
            console.error("cart not added", error);
            throw error;
        }
    }

    async function handleGetCart() {
        try {
             const data = await getCart()
             dispatch(setItems(data.cart.items))
        } catch (error) {
            console.error("cart not found", error);
            throw error;
        }
    }
    return { handleAddtoCart, handleGetCart };
}