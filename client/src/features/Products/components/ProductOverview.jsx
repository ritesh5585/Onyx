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
      <div className="flex items-start justify-between gap-4 mb-1">
        <h1
          className="text-3xl lg:text-4xl xl:text-5xl font-light leading-[1.1] tracking-tight text-[#eee9e1] flex-1"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
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
      <p
        className="text-2xl lg:text-3xl font-light tracking-wide text-[#c49a52] mt-4 mb-5"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {priceCurrency || "INR"}{" "}
        <span className="font-medium">{priceAmount?.toLocaleString() || "0"}</span>
      </p>

      {/* Divider */}
      <div className="w-8 h-px bg-[#c49a52] mb-7" />

      {/* Description */}
      <div>
        <h3 className="onyx-label mb-3">Description</h3>
        <p
          className="text-[14px] sm:text-[15px] leading-[1.8] text-[rgba(238,233,225,0.55)] whitespace-pre-line"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProductOverview;
