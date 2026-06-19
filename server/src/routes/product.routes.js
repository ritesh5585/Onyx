import { Router } from 'express'
import multer from 'multer'
import { createProductValidator } from '../validator/product.validator.js'
import { authenticateUser, requireSeller } from '../middleware/auth.middleware.js'
import { createProduct, getAllProducts, getSellerProducts } from '../controller/product.controller.js'

const router = Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})

/**
 * @route Get /api/products 
 * @description: get all product posted by all seller
 */
router.get("/", getAllProducts)

/**
 * @route GET /api/products/seller 
 * @description: get all product posted by seller
 */
router.get('/seller', authenticateUser, requireSeller, getSellerProducts)

/**
 * @route POST /api/products/
 * @description: Create a product only from the sellers
 */

router.post('/', authenticateUser, requireSeller, upload.array('images', 7), createProductValidator, createProduct)

export default router