import React from 'react';
import { ShieldCheck } from 'lucide-react';
import StarRating from './StarRating';

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const initials = review.user?.fullname
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="py-5 border-b border-onyx-border/50 last:border-0 group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-onyx-gold/30 to-onyx-gold/10 flex items-center justify-center shrink-0 border border-onyx-gold/20">
          <span className="text-[11px] font-bold text-onyx-gold">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <span className="font-semibold text-sm text-onyx-text">
              {review.user?.fullname || 'Anonymous'}
            </span>
            {review.verifiedPurchase && (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                <ShieldCheck size={11} />
                Verified Purchase
              </span>
            )}
            <span className="text-[11px] text-onyx-muted ml-auto shrink-0">{date}</span>
          </div>

          <StarRating rating={review.rating} size={13} />

          {review.title && (
            <p className="font-semibold text-sm text-onyx-text mt-2">{review.title}</p>
          )}
          <p className="text-sm text-onyx-muted mt-1.5 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
