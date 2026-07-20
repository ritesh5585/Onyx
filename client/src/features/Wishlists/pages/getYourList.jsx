import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../../cart/hooks/useCart';
import Layout from '../../Shared/Layout';
import EmptyState from '../../components/EmptyState';
import { toast } from 'sonner';

const GetYourList = () => {
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.wishlist) || [];
  const { handleGetWishlist, handleDeleteWishlist } = useWishlist();
  const { handleAddtoCart } = useCart();

  useEffect(() => {
    handleGetWishlist().catch(() => {});
  }, [handleGetWishlist]);

  const isEmpty = wishlist.length === 0;

  return (
    <Layout showBackButton={true}>
      <div className="min-h-[60vh] pb-24 pt-8">
        <div className="mb-8 sm:mb-10 border-b border-onyx-border/70 pb-6 sm:pb-8">
          <p className="onyx-eyebrow mb-3">Your Favorites</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-onyx-text">Wishlist</h1>
          <div className="onyx-divider" />
          {!isEmpty && (
            <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-onyx-muted/70">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isEmpty ? (
          <EmptyState
            icon="♡"
            eyebrow="Empty Wishlist"
            title="Save your favorites here."
            body="Keep track of pieces you love."
            cta={{ label: "Discover Products", to: "/" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8">
            {wishlist.map((item) => {
              const product = item.productId || {};
              const imageUrl = product.images?.[0]?.url || null;
              const unitPrice = product.price?.amount || 0;
              const currency = product.price?.currency || "INR";
              const isInStock = (product.stock ?? 0) > 0;

              return (
                <div key={item._id} className="onyx-card flex flex-col group h-full">
                  <div 
                    className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-onyx-black cursor-pointer border border-onyx-border/70"
                    onClick={() => product._id && navigate(`/product/${product._id}`)}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-onyx-muted/40">No Image</span>
                      </div>
                    )}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await handleDeleteWishlist(item._id);
                          toast.success("Removed from wishlist");
                        } catch {
                          toast.error("Failed to remove");
                        }
                      }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-md transition-all duration-300 hover:bg-red-500/20"
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  
                  <div className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="cursor-pointer line-clamp-1 font-serif text-lg leading-tight text-onyx-text transition-colors duration-300 hover:text-onyx-gold" onClick={() => product._id && navigate(`/product/${product._id}`)}>
                        {product.title || "Untitled Product"}
                      </h3>
                      <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-onyx-muted">
                        {currency} {unitPrice.toLocaleString()}
                      </p>
                    </div>
                    
                    <button
                      className="onyx-btn-primary mt-4 w-full flex items-center justify-center gap-2"
                      disabled={!isInStock}
                      onClick={async () => {
                        if (!product._id) return;
                        try {
                          await handleAddtoCart(product._id);
                          toast.success("Added to cart");
                        } catch {
                          toast.error("Failed to add to cart");
                        }
                      }}
                    >
                      {isInStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GetYourList;