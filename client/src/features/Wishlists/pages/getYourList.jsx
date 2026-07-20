import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../../cart/hooks/useCart";
import Layout from "../../Shared/Layout";
import EmptyState from "../../components/EmptyState";
import { toast } from "sonner";

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
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-onyx-text">
            Wishlist
          </h1>
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
          <div className="flex flex-col border-t border-onyx-border/70">
            {wishlist.map((item) => {
              const product = item.productId || {};
              const imageUrl = product.images?.[0]?.url || null;
              const unitPrice = product.price?.amount || 0;
              const itemCurrency = product.price?.currency || "INR";
              const stock = product.stock ?? 0;
              const isInStock = stock > 0;

              return (
                <div key={item._id} className="flex gap-3 sm:gap-5 border-b border-onyx-border/70 py-5 sm:py-7">
                  {/* Image */}
                  <div
                    className="group/img h-[110px] w-[85px] sm:h-[130px] sm:w-[100px] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border border-onyx-border/70 bg-onyx-black"
                    onClick={() => product._id && navigate(`/product/${product._id}`)}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[9px] uppercase tracking-[0.15em] text-onyx-muted/40">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <span
                        className="cursor-pointer truncate font-serif text-sm sm:text-base leading-tight text-onyx-text transition-colors duration-300 hover:text-onyx-gold sm:text-lg"
                        onClick={() => product._id && navigate(`/product/${product._id}`)}
                      >
                        {product.title || "Untitled Product"}
                      </span>
                      
                      <span className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-onyx-muted/80">
                        {itemCurrency} {unitPrice.toLocaleString()}
                      </span>
                      
                      <span className={`mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${isInStock ? "text-[#81c784]" : "text-[#e57373]"}`}>
                        <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${isInStock ? "bg-[#81c784]" : "bg-[#e57373]"}`} />
                        {isInStock ? `${stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        className="onyx-btn-primary !py-2 !px-4 text-[10px] flex items-center gap-2"
                        disabled={!isInStock}
                        onClick={() => {
                          if (!isInStock || !product._id) return;
                          handleAddtoCart(product._id)
                            .then(() => toast.success("Added to cart"))
                            .catch(() => toast.error("Failed to add to cart"));
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        Add to Cart
                      </button>

                      <button
                        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-red-400/20 bg-transparent px-3 py-1.5 sm:py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400 transition-all hover:border-red-400/45 hover:bg-red-400/10"
                        onClick={() => {
                          handleDeleteWishlist(item._id)
                            .then(() => toast.success("Removed from wishlist"))
                            .catch(() => toast.error("Failed to remove"));
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
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
