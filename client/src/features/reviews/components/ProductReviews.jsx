import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useReview } from '../hooks/useReview';

const RatingSummaryBar = ({ label, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-onyx-muted w-8 shrink-0 text-right">{label}★</span>
      <div className="flex-1 h-1.5 bg-onyx-border rounded-full overflow-hidden">
        <div
          className="h-full bg-onyx-gold rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-onyx-muted w-5 shrink-0">{count}</span>
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const {
    reviews,
    summary,
    myReview,
    isLoading,
    isSubmitting,
    loadReviews,
    handleSubmitReview,
    handleDeleteReview,
  } = useReview(productId);

  useEffect(() => {
    if (productId) loadReviews();
  }, [productId, loadReviews]);

  return (
    <section className="mt-16 pt-12 border-t border-onyx-border/50">
      {/* Header */}
      <div className="mb-8">
        <p className="onyx-eyebrow mb-2">Customer Feedback</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-onyx-text leading-tight">
          Reviews & Ratings
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* Left: Summary + Form */}
        <div className="space-y-6">
          {/* Rating Summary */}
          {summary.totalReviews > 0 ? (
            <div className="p-5 rounded-xl border border-onyx-border bg-onyx-surface">
              <div className="flex items-end gap-3 mb-4">
                <span className="font-serif text-5xl font-light text-onyx-text">
                  {summary.avgRating?.toFixed(1)}
                </span>
                <div className="pb-1">
                  <StarRating rating={summary.avgRating} size={16} />
                  <p className="text-[11px] text-onyx-muted mt-1">
                    {summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingSummaryBar
                    key={star}
                    label={star}
                    count={summary.breakdown?.[star] || 0}
                    total={summary.totalReviews}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-onyx-border bg-onyx-surface text-center">
              <MessageSquare size={28} className="text-onyx-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-onyx-muted">No reviews yet.</p>
              <p className="text-xs text-onyx-muted/60 mt-1">Be the first to share your thoughts!</p>
            </div>
          )}

          {/* Write Review Form */}
          <ReviewForm
            productId={productId}
            myReview={myReview}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitReview}
            onDelete={handleDeleteReview}
          />
        </div>

        {/* Right: Reviews List */}
        <div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="py-5 border-b border-onyx-border/50 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-onyx-surface" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-onyx-surface rounded w-32" />
                      <div className="h-3 bg-onyx-surface rounded w-24" />
                      <div className="h-3 bg-onyx-surface rounded w-full" />
                      <div className="h-3 bg-onyx-surface rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-onyx-border rounded-xl">
              <MessageSquare size={36} className="text-onyx-muted/30 mb-3" />
              <p className="text-onyx-muted text-sm">No reviews yet for this product.</p>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
