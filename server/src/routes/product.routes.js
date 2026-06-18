import { Router } from 'express'
import multer from 'multer'
import { createProductValidator } from '../validator/product.validator.js'
import { authenticateUser, requireSeller } from '../middleware/auth.middleware.js'
import { createProduct, getSellerProducts } from '../controller/product.controller.js'

const router = Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const sellerGuard = [authenticateUser, requireSeller]

router.get('/seller', sellerGuard, getSellerProducts)
router.post('/', sellerGuard, upload.array('images', 7), createProductValidator, createProduct)

export default router