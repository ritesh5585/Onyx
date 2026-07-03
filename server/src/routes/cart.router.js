import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validator/cart.validator.js"
import { addToCart, viewCartProduct } from "../controller/cart.controller.js"

const router = Router()

router.post("/", authenticateUser, validateAddToCart, addToCart)
router.get("/", authenticateUser, viewCartProduct)

export default router