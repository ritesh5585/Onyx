import { Router } from 'express'
import multer from 'multer'
import { createProductValidator } from '../validator/product.validator.js'
import { authenticateUser, requireSeller } from '../middleware/auth.middleware.js'
import {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProductDetail,
    addProductvariants,
    updateProductInfo,
    deleteProduct,
    deleteProductVariant
} from '../controller/product.controller.js'

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
 * @route GET /api/products/{:id} 
 * @description: view product posted by seller
 */
router.get("/:id", getProductDetail)

/**
 * @route GET /api/products/{:id}/variants 
 * @description: Add new Variants to the product
 */
router.post("/:id/variants", authenticateUser, requireSeller, addProductvariants)

/**
 * @route PATCH /api/products/{:id}
 * @description: Update product title, description or price
 */
router.patch("/:id", authenticateUser, requireSeller, updateProductInfo)


/**
 * @route POST /api/products/
 * @description: Create a product only from the sellers
 */
router.post('/', authenticateUser, requireSeller, upload.array('images', 7), createProductValidator, createProduct)

/**
 * @route DELETE /api/products/product-deleting/:id
 * @description: Delete a product and its images (only for the seller who created it)
 */
router.delete('/product-deleting/:id', authenticateUser, requireSeller, deleteProduct)

/**
 * @route DELETE /api/products/product-deleting/:id/variants/:variantId
 * @description: Delete a product variant and its images (only for the seller who created it)
 */
router.delete('/product-deleting/:id/variants/:variantId', authenticateUser, requireSeller, deleteProductVariant)

export default router