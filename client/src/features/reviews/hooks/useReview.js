// Layer 3: Hook — business logic + dispatch bridge
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReviews,
  setMyReview,
  upsertReview,
  removeReviewFromState,
  setLoading,
  setSubmitting,
  setError,
} from "../state/review.slice";
import {
  fetchProductReviews,
  fetchMyReview,
  submitReview,
  removeReview,
} from "../service/review.api";

export const useReview = (productId) => {
  const dispatch = useDispatch();
  const productData = useSelector((s) => s.review.byProduct[productId]) || {};
  const { reviews = [], summary = {}, myReview = null } = productData;
  const isLoading = useSelector((s) => s.review.isLoading);
  const isSubmitting = useSelector((s) => s.review.isSubmitting);
  const error = useSelector((s) => s.review.error);

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const [reviewsData, myReviewData] = await Promise.all([
        fetchProductReviews(productId),
        fetchMyReview(productId).catch(() => ({ review: null })),
      ]);
      dispatch(setReviews({ productId, reviews: reviewsData.reviews, summary: reviewsData.summary }));
      dispatch(setMyReview({ productId, review: myReviewData.review }));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, productId]);

  const handleSubmitReview = useCallback(async (data) => {
    dispatch(setSubmitting(true));
    dispatch(setError(null));
    try {
      const result = await submitReview(productId, data);
      if (result.success) {
        dispatch(upsertReview({ productId, review: result.review }));
        // Refresh summary stats
        const refreshed = await fetchProductReviews(productId);
        dispatch(setReviews({ productId, reviews: refreshed.reviews, summary: refreshed.summary }));
      }
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      dispatch(setError(msg));
      throw err;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch, productId]);

  const handleDeleteReview = useCallback(async (reviewId) => {
    try {
      await removeReview(reviewId);
      dispatch(removeReviewFromState({ productId, reviewId }));
      const refreshed = await fetchProductReviews(productId);
      dispatch(setReviews({ productId, reviews: refreshed.reviews, summary: refreshed.summary }));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    }
  }, [dispatch, productId]);

  return {
    reviews,
    summary,
    myReview,
    isLoading,
    isSubmitting,
    error,
    loadReviews,
    handleSubmitReview,
    handleDeleteReview,
  };
};
