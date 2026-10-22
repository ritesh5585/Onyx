// Reusable Star Rating display component
import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, max = 5, size = 16, interactive = false, onRate }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={`transition-transform duration-150 ${interactive ? 'cursor-pointer hover:scale-125 focus:outline-none' : 'cursor-default'}`}
            aria-label={`${i + 1} star${i + 1 !== 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${
                filled
                  ? 'text-onyx-gold fill-onyx-gold'
                  : interactive
                    ? 'text-onyx-border hover:text-onyx-gold'
                    : 'text-onyx-border'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
