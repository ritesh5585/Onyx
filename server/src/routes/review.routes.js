import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createReview,
  getProductReviews,
  deleteReview,
  getMyReview,
} from "../controller/review.controller.js";

const router = Router();

/**
 * @route POST /api/review/:productId
 * @description Submit a review for a product (requires auth)
 */
router.post("/:productId", authenticateUser, createReview);

/**
 * @route GET /api/review/:productId
 * @description Get all reviews + rating summary for a product (public)
 */
router.get("/:productId", getProductReviews);

/**
 * @route GET /api/review/:productId/mine
 * @description Get the current user's review for a product
 */
router.get("/:productId/mine", authenticateUser, getMyReview);

/**
 * @route DELETE /api/review/:reviewId
 * @description Delete own review
 */
router.delete("/:reviewId", authenticateUser, deleteReview);

export default router;
