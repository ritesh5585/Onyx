import React from "react";

// A reusable component for displaying the core product information
// Works for both buyer view and seller view (with optional 'children' for actions like "Edit Details")
const ProductOverview = ({
  title,
  priceAmount,
  priceCurrency,
  description,
  children,
}) => {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h1 className="onyx-page-title">{title}</h1>
        {/* Render optional action buttons (e.g. Edit Details) passed as children */}
        {children}
      </div>

      <p className="text-2xl font-semibold tracking-wide text-[#c49a52] mt-4 mb-6 font-['Inter',system-ui,sans-serif]">
        {priceCurrency || "INR"} {priceAmount?.toLocaleString() || "0"}
      </p>

      <div className="onyx-divider" />

      <div className="mt-8 mb-10">
        <h3 className="onyx-label">Description</h3>
        <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line">
          {description}
        </p>
      </div>
    </>
  );
};

export default ProductOverview;
