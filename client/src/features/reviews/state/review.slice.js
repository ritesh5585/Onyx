// Layer 2: State — Redux slice
import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    byProduct: {}, // { [productId]: { reviews: [], summary: {}, myReview: null } }
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    setReviews: (state, action) => {
      const { productId, reviews, summary } = action.payload;
      if (!state.byProduct[productId]) state.byProduct[productId] = {};
      state.byProduct[productId].reviews = reviews;
      state.byProduct[productId].summary = summary;
    },
    setMyReview: (state, action) => {
      const { productId, review } = action.payload;
      if (!state.byProduct[productId]) state.byProduct[productId] = {};
      state.byProduct[productId].myReview = review;
    },
    upsertReview: (state, action) => {
      const { productId, review } = action.payload;
      if (!state.byProduct[productId]) state.byProduct[productId] = { reviews: [], summary: {} };
      const idx = state.byProduct[productId].reviews?.findIndex(
        (r) => r._id === review._id || r.user?._id === review.user?._id
      );
      if (idx !== undefined && idx >= 0) {
        state.byProduct[productId].reviews[idx] = review;
      } else {
        state.byProduct[productId].reviews?.unshift(review);
      }
      state.byProduct[productId].myReview = review;
    },
    removeReviewFromState: (state, action) => {
      const { productId, reviewId } = action.payload;
      if (state.byProduct[productId]?.reviews) {
        state.byProduct[productId].reviews = state.byProduct[productId].reviews.filter(
          (r) => r._id !== reviewId
        );
        state.byProduct[productId].myReview = null;
      }
    },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setSubmitting: (state, action) => { state.isSubmitting = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const {
  setReviews,
  setMyReview,
  upsertReview,
  removeReviewFromState,
  setLoading,
  setSubmitting,
  setError,
} = reviewSlice.actions;

export default reviewSlice.reducer;
