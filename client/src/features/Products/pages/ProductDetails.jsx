import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const detail = useSelector((state) => state.product.details);
  const { handleProductDetails } = useProduct();

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  if (!detail) {
    return (
      <div className="onyx-bg min-h-screen flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse text-[#c49a52]">
          Loading Details...
        </span>
      </div>
    );
  }

  const imageUrls =
    detail.images && detail.images.length > 0
      ? detail.images.map((img) => img.url)
      : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];

  const mainImage = imageUrls[selectedImage] || imageUrls[0];

  return (
    <div className="onyx-bg min-h-screen">
      {/* Navigation */}
      <div className="py-4 md:py-5 lg:mx-10 mx-4 flex items-center gap-3 border-b border-[#1f1f1f]">
        <button
          onClick={() => navigate(-1)}
          className="onyx-nav-back"
          type="button"
        >
          ←
        </button>
        <span className="onyx-nav-title">ONYX.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 xl:px-24 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-[#0f0f13] rounded-xl overflow-hidden flex items-center justify-center border border-[#1f1f1f]">
              <img
                src={mainImage}
                alt={detail.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            {imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-24 bg-[#0f0f13] rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-[#c49a52]"
                        : "border-transparent hover:border-[#1f1f1f]"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${detail.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <h1 className="onyx-page-title mb-2">{detail.title}</h1>

            <div
              className="text-2xl font-semibold tracking-wide text-[#c49a52] mt-4 mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {detail.price?.currency || "INR"}{" "}
              {detail.price?.amount?.toLocaleString() || "0"}
            </div>

            <div className="onyx-divider mb-8" />

            <div className="flex-grow">
              <h3 className="onyx-label mb-3">Description</h3>
              <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line mb-8">
                {detail.description}
              </p>

              {/* Extra Details for UI richness */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <h3 className="onyx-label mb-1">Availability</h3>
                  <p className="text-sm text-[#eee9e1]">In Stock</p>
                </div>
                <div>
                  <h3 className="onyx-label mb-1">Shipping</h3>
                  <p className="text-sm text-[#eee9e1]">Ships in 2-3 days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-[#1f1f1f]">
              <button
                type="button"
                className="flex-1 py-[13px] px-5 text-[14px] font-semibold transition-all duration-200 rounded-lg border border-[#c49a52] text-[#c49a52] hover:bg-[#c49a52] hover:text-[#0b0b0d]"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                ADD TO CART
              </button>
              <button type="button" className="onyx-btn-primary flex-1">
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
