import reviewModel from "../models/review.js";
import orderModel from "../models/order.js";

/**
 * POST /api/review/:productId
 * Create or update a review. Checks if user has purchased the product.
 */
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if user has a delivered order with this product
    const purchasedOrder = await orderModel.findOne({
      user: userId,
      status: "delivered",
      "items.product": productId,
    });

    const verifiedPurchase = !!purchasedOrder;

    // Upsert: update existing review or create new one
    const review = await reviewModel.findOneAndUpdate(
      { product: productId, user: userId },
      { rating, title, comment, verifiedPurchase },
      { new: true, upsert: true, runValidators: true }
    );

    await review.populate("user", "fullname");

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "You have already reviewed this product" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error submitting review", error: error.message });
  }
};

/**
 * GET /api/review/:productId
 * Get all reviews for a product with aggregate rating summary
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ product: productId })
      .populate("user", "fullname")
      .sort({ createdAt: -1 });

    // Compute aggregate stats
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Rating breakdown (1-5 star counts)
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => breakdown[r.rating]++);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
      summary: {
        totalReviews,
        avgRating: parseFloat(avgRating.toFixed(1)),
        breakdown,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching reviews", error: error.message });
  }
};

/**
 * DELETE /api/review/:reviewId
 * Delete own review
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this review" });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    return res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting review", error: error.message });
  }
};

/**
 * GET /api/review/:productId/mine
 * Check if the current user has already reviewed a product
 */
export const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const review = await reviewModel.findOne({
      product: productId,
      user: req.user._id,
    });

    return res.status(200).json({ success: true, review: review || null });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching your review", error: error.message });
  }
};
