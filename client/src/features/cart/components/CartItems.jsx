import React, { useMemo } from "react";
import { toast } from "sonner";

const CartItems = ({
  item,
  navigate,
  onIncrementQty,
  onDecrementQty,
  onRemoveItem,
}) => {
  const product = item.product || {};
  const variant = item.variant || null;
  const qty = item.quantity || 1;
  const unitPrice = variant?.price?.amount || product?.price?.amount || 0;
  const stock = variant?.stock ?? product?.stock ?? 0;
  const isInStock = stock > 0;
  const imageUrl =
    variant?.images?.[0]?.url || product?.images?.[0]?.url || null;
  const itemCurrency =
    variant?.price?.currency || product?.price?.currency || "INR";

  const variantLabel = useMemo(() => {
    if (!variant?.attributes) return "";
    try {
      const attrs = variant.attributes;
      const entries =
        attrs instanceof Map
          ? Array.from(attrs.entries())
          : Object.entries(attrs);
      return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
    } catch {
      return "";
    }
  }, [variant]);

  return (
    <div className="flex gap-3 sm:gap-5 border-b border-onyx-border/70 py-5 sm:py-7 first:border-t">
      {/* ── Image ── */}
      <div
        className="group/img h-[95px] w-[72px] xs:h-[110px] xs:w-[85px] sm:h-[130px] sm:w-[100px] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border border-onyx-border/70 bg-onyx-surface"
        onClick={() => product._id && navigate(`/product/${product._id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          product._id &&
          navigate(`/product/${product._id}`)
        }
        aria-label={`View ${product.title}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.15em] text-onyx-muted/40">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span
            className="cursor-pointer truncate font-serif text-sm sm:text-base leading-tight text-onyx-text transition-colors duration-300 hover:text-onyx-gold sm:text-lg"
            onClick={() => product._id && navigate(`/product/${product._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              product._id &&
              navigate(`/product/${product._id}`)
            }
          >
            {product.title || "Untitled Product"}
          </span>

          {variantLabel && (
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-onyx-muted/60">
              {variantLabel}
            </span>
          )}

          <span className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-onyx-muted/80">
            {itemCurrency} {(unitPrice * qty).toLocaleString()}
          </span>

          <span
            className={`mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isInStock ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${isInStock ? "bg-emerald-400" : "bg-red-400"}`}
            />
            {isInStock ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* ── Actions ── */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center overflow-hidden rounded-md border border-onyx-border/70 bg-onyx-surface">
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent text-lg leading-none text-onyx-muted/70 transition-all hover:bg-onyx-gold/10 hover:text-onyx-gold disabled:opacity-25"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              onClick={async () => {
                if (!item._id || qty <= 1) return;
                try {
                  await onDecrementQty(item._id, qty);
                  toast.success("Quantity updated");
                } catch {
                  toast.error("Failed to update quantity");
                }
              }}
            >
              −
            </button>
            <span className="w-8 sm:w-9 border-x border-onyx-border/70 py-1.5 text-center text-[13px] font-semibold text-onyx-text">
              {qty}
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center text-onyx-muted/50 hover:text-onyx-gold hover:bg-onyx-gold/7 disabled:opacity-25 transition-all border-none bg-transparent cursor-pointer text-lg leading-none"
              disabled={qty >= stock}
              aria-label="Increase quantity"
              onClick={async () => {
                if (!item._id || qty >= stock) return;
                try {
                  await onIncrementQty(item._id, qty);
                  toast.success("Quantity updated");
                } catch {
                  toast.error("Failed to update quantity");
                }
              }}
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-red-400/20 bg-transparent px-2.5 sm:px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400 transition-all hover:border-red-400/45 hover:bg-red-400/10"
            onClick={async () => {
              if (!item._id) return;
              try {
                await onRemoveItem(item._id);
                toast.success("Item removed from cart");
              } catch {
                toast.error("Failed to remove item");
              }
            }}
          >
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
