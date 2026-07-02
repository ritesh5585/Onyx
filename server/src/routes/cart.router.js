import { Router } from "express"
import { authenticateUser } from "../middleware/auth.middleware.js"
import { validateAddToCart } from "../validator/cart.validator.js"

const router = Router()

router.post("/", authenticateUser, validateAddToCart)

export default router