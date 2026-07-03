import { addToCart } from "../service/cart.api";
import { useDispatch } from "react-redux"
import addItems from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()

    function handleAddtoCart() {
        try {
            const data = await addItems({ productId, variantId })
            return data
        } catch (error) {
            console.error("cart not added", error)
            throw new error
        }
    }
}