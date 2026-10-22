import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Send, Pencil, Trash2 } from 'lucide-react';
import StarRating from './StarRating';
import { useSelector } from 'react-redux';

const ReviewForm = ({ productId, myReview, isSubmitting, onSubmit, onDelete }) => {
  const user = useSelector((s) => s.auth.user);
  const [rating, setRating] = useState(myReview?.rating || 0);
  const [title, setTitle] = useState(myReview?.title || '');
  const [comment, setComment] = useState(myReview?.comment || '');
  const [isEditing, setIsEditing] = useState(!myReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a star rating');
    if (!comment.trim()) return toast.error('Please write a comment');

    try {
      await onSubmit({ rating, title, comment });
      toast.success(myReview ? 'Review updated!' : 'Review submitted!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!user) {
    return (
      <div className="p-5 rounded-xl border border-onyx-border bg-onyx-surface text-center">
        <p className="text-sm text-onyx-muted">
          <a href="/login" className="text-onyx-gold hover:underline font-semibold">Sign in</a> to leave a review
        </p>
      </div>
    );
  }

  // Show existing review in read mode
  if (myReview && !isEditing) {
    return (
      <div className="p-5 rounded-xl border border-onyx-gold/20 bg-onyx-gold/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <StarRating rating={myReview.rating} size={14} />
              <span className="text-[11px] uppercase tracking-widest text-onyx-gold font-semibold">Your Review</span>
            </div>
            {myReview.title && (
              <p className="font-semibold text-onyx-text text-sm mt-2">{myReview.title}</p>
            )}
            <p className="text-sm text-onyx-muted mt-1 leading-relaxed">{myReview.comment}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setRating(myReview.rating); setTitle(myReview.title || ''); setComment(myReview.comment); setIsEditing(true); }}
              className="p-2 rounded-lg text-onyx-muted hover:text-onyx-gold hover:bg-onyx-gold/10 transition-colors"
              title="Edit review"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(myReview._id)}
              className="p-2 rounded-lg text-onyx-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete review"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-onyx-border bg-onyx-surface space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-onyx-text">
          {myReview ? 'Edit Your Review' : 'Write a Review'}
        </p>
        {myReview && (
          <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-onyx-muted hover:text-onyx-text">
            Cancel
          </button>
        )}
      </div>

      {/* Star Picker */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-onyx-muted mb-2">Your Rating *</p>
        <StarRating rating={rating} size={24} interactive onRate={setRating} />
      </div>

      {/* Title */}
      <div>
        <label className="text-[11px] uppercase tracking-widest text-onyx-muted block mb-1.5">
          Title <span className="text-onyx-muted/50">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience..."
          maxLength={100}
          className="w-full bg-onyx-black border border-onyx-border rounded-lg px-4 py-2.5 text-sm text-onyx-text placeholder:text-onyx-muted/50 focus:border-onyx-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="text-[11px] uppercase tracking-widest text-onyx-muted block mb-1.5">
          Your Review *
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          maxLength={1000}
          className="w-full bg-onyx-black border border-onyx-border rounded-lg px-4 py-2.5 text-sm text-onyx-text placeholder:text-onyx-muted/50 focus:border-onyx-gold focus:outline-none transition-colors resize-none"
        />
        <p className="text-[10px] text-onyx-muted/50 text-right mt-1">{comment.length}/1000</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="onyx-btn-primary flex items-center gap-2"
      >
        {isSubmitting ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting...</>
        ) : (
          <><Send size={16} /> {myReview ? 'Update Review' : 'Submit Review'}</>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
