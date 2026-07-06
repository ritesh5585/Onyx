import React from "react";

/**
 * ProductCard — Shared reusable product card for Home and Dashboard grids.
 * Accepts: product object, onClick handler.
 * Zero business logic — purely presentational.
 */
const ProductCard = ({ product, onClick }) => {
  const imageUrl = product.images?.length > 0 ? product.images[0].url : null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="group cursor-pointer flex flex-col outline-none focus-visible:ring-1 focus-visible:ring-[#c49a52] rounded-sm"
      aria-label={product.title}
    >
      {/* ── Image ── */}
      <div className="aspect-[3/4] bg-[#0d0d12] overflow-hidden mb-4 relative border border-[rgba(255,255,255,0.05)] rounded-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[rgba(238,233,225,0.2)]">No Image</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#06060a] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1 px-0.5">
        <h3
          className="text-sm sm:text-base leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[#c49a52]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}
        >
          {product.title}
        </h3>
        <p className="text-[11px] leading-relaxed line-clamp-1 text-[rgba(238,233,225,0.4)] hidden sm:block">
          {product.description}
        </p>
        <span className="mt-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-[rgba(238,233,225,0.7)]">
          {product.price?.currency || "INR"}{" "}
          {product.price?.amount?.toLocaleString() || "0"}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
