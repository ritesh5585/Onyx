import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validator/cart.validator.js"
import { addToCart, viewCartProduct, removeFromCart, updateCartItemQuantity } from "../controller/cart.controller.js"

const router = Router()

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)
router.get("/get", authenticateUser, viewCartProduct)
router.delete("/remove/:cartItemId", authenticateUser, removeFromCart)
router.patch("/update/:cartItemId", authenticateUser, updateCartItemQuantity)

export default router