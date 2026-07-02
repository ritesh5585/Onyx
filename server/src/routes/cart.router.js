import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validator/cart.validator.js"
import { addToCart } from "../controller/cart.controller.js"

const router = Router()

router.post("/", authenticateUser, validateAddToCart, addToCart)

export default router