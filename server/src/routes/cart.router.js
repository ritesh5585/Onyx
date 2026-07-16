import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validator/cart.validator.js"
import { addToCart, viewCartProduct, removeFromCart, updateCartItemQuantity } from "../controller/cart.controller.js"
import { createOrderPayment } from "../controller/payment.controller.js"

const router = Router()

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @description Add a product or variant to the authenticated user's cart.
*/
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)

/**
 * @route GET /api/cart/get
 * @description Fetch the authenticated user's current cart details.
*/
router.get("/get", authenticateUser, viewCartProduct)

/**
 * @route DELETE /api/cart/remove/:cartItemId
 * @description Remove a specific cart item from the authenticated user's cart.
*/
router.delete("/remove/:cartItemId", authenticateUser, removeFromCart)

/**
 * @route PATCH /api/cart/update/:cartItemId
 * @description Update the quantity of a specific cart item for the authenticated user.
*/
router.patch("/update/:cartItemId", authenticateUser, updateCartItemQuantity)

export default router