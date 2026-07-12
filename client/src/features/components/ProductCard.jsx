import React, { useRef } from "react";
import { animateCardHover } from "../Shared/animations";

const ProductCard = ({ product, onClick }) => {
  const cardRef = useRef(null);
  const imageUrl = product.images?.length > 0 ? product.images[0].url : null;

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      onMouseEnter={() => animateCardHover(cardRef.current, true)}
      onMouseLeave={() => animateCardHover(cardRef.current, false)}
      className="group flex cursor-pointer flex-col rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-onyx-gold"
      aria-label={product.title}
    >
      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-sm border border-onyx-border/60 bg-onyx-surface">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-onyx-muted/40">
              No Image
            </span>
          </div>
        )}
        <div className="card-overlay absolute inset-0 bg-onyx-bg/0 opacity-0" />
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="line-clamp-1 font-serif text-sm leading-snug text-onyx-text sm:text-base">
          {product.title}
        </h3>
        <p className="hidden text-[11px] leading-relaxed text-onyx-muted/70 line-clamp-1 sm:block">
          {product.description}
        </p>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-onyx-muted/80">
          {product.price?.currency || "INR"}{" "}
          {product.price?.amount?.toLocaleString() || "0"}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
