import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist

} from '../controller/wishlist.controller.js';

const router = Router();

/**
 * @route Get /api/wishlist
 * @description: get all wishlist items for the authenticated user
 */
router.get('/', authenticateUser, getWishlist)

/**
 * @route Post /api/wishlist
 * @description: add a product to the wishlist for the authenticated user
 */
router.post('/', authenticateUser, addToWishlist)

/**
 * @route Delete /api/wishlist/:id
 * @description: remove a product from the wishlist for the authenticated user
 */
router.delete('/:id', authenticateUser, removeFromWishlist)

export default router;