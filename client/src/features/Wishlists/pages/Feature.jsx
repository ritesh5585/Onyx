import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWishlist } from '../hooks/useWishlist';
import { toast } from 'sonner';

const Feature = ({ productId }) => {
  const wishlist = useSelector((state) => state.wishlist?.wishlist) || [];
  const { handleAddToWishlist, handleDeleteWishlist } = useWishlist();

  const wishlistItem = useMemo(() => {
    return wishlist.find(item => item.productId?._id === productId || item.productId === productId);
  }, [wishlist, productId]);

  const isInWishlist = !!wishlistItem;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await handleDeleteWishlist(wishlistItem._id);
        toast.success("Removed from wishlist");
      } else {
        await handleAddToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error(isInWishlist ? "Failed to remove" : "Failed to add");
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`absolute top-2 right-2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
        isInWishlist 
          ? 'bg-onyx-surface/90 text-onyx-gold border border-onyx-gold shadow-[0_0_8px_rgba(196,154,82,0.4)]' 
          : 'bg-onyx-surface/60 text-onyx-text/50 border border-onyx-border/70 hover:text-onyx-text hover:bg-onyx-surface/90 hover:border-onyx-border-hover'
      }`}
      aria-label="Toggle Wishlist"
    >
      <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default Feature;