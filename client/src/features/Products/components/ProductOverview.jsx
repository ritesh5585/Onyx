import React from "react";

/**
 * ProductOverview — Core product info block.
 * Used by both ProductDetails (buyer) and SellerProductdetail (seller).
 * Children = optional action buttons (Edit, Delete, etc.)
 */
const ProductOverview = ({
  title,
  priceAmount,
  priceCurrency,
  description,
  children,
}) => {
  return (
    <div className="mb-8">
      {/* Title + Actions row */}
      <div className="mb-1 flex items-start justify-between gap-4">
        <h1 className="flex-1 font-serif text-3xl font-light leading-[1.1] tracking-tight text-onyx-text lg:text-4xl xl:text-5xl">
          {title}
        </h1>
        {/* Optional seller actions (Edit / Remove buttons) */}
        {children && (
          <div className="flex-shrink-0 flex flex-col items-end gap-1.5 mt-1">
            {children}
          </div>
        )}
      </div>

      {/* Price */}
      <p className="mb-5 mt-4 font-serif text-2xl font-light tracking-wide text-onyx-gold lg:text-3xl">
        {priceCurrency || "INR"}{" "}
        <span className="font-medium">
          {priceAmount?.toLocaleString() || "0"}
        </span>
      </p>

      {/* Divider */}
      <div className="w-8 h-px bg-[#c49a52] mb-7" />

      {/* Description */}
      <div>
        <h3 className="onyx-label mb-3">Description</h3>
        <p className="font-sans whitespace-pre-line text-[14px] leading-[1.8] text-onyx-muted sm:text-[15px]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProductOverview;
