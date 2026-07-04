import { addToCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddtoCart(productId, variantId) {
        try {
            console.log("handleAddtoCart hit")
            const data = await addToCart({ productId, variantId });
            console.log("Datafetched")
            return data;
        } catch (error) {
            console.error("cart not added", error);
            throw error;
        }
    }

    return { handleAddtoCart };
}