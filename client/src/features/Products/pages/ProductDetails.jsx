import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";

const readAttributes = (attrs) => {
  if (!attrs) return [];
  if (typeof attrs.entries === "function") return Array.from(attrs.entries());
  return Object.entries(attrs);
};

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const detail = useSelector((state) => state.product.details);

  const { handleProductDetails } = useProduct();

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  useEffect(() => {
    setSelectedVariant(null);
    setSelectedImage(0);
  }, [detail]);

  if (!detail) {
    return <Spinner />;
  }

  const activeImages = selectedVariant?.images?.length > 0 
    ? selectedVariant.images 
    : detail.images;

  const imageUrls =
    activeImages && activeImages.length > 0
      ? activeImages.map((img) => img.url)
      : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];

  const mainImage = imageUrls[selectedImage] || imageUrls[0];

  const activePrice = selectedVariant?.price?.amount 
    ? selectedVariant.price 
    : detail.price;

  const stockStatus = selectedVariant 
    ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} In Stock` : "Out of Stock")
    : "In Stock"; // Default for main product

  return (
    <Layout showBackButton={true}>
      <div className="py-10 md:py-16">
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
            <h1 className="onyx-page-title">{detail.title}</h1>

            <p className="text-2xl font-semibold tracking-wide text-[#c49a52] mt-4 mb-6 font-['Inter',system-ui,sans-serif]">
              {activePrice?.currency || "INR"}{" "}
              {activePrice?.amount?.toLocaleString() || "0"}
            </p>

            <div className="onyx-divider" />

            <div className="flex-grow">
              <h3 className="onyx-label">Description</h3>
              <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line mb-8">
                {detail.description}
              </p>

              {/* Variants Selection */}
              {detail.variants?.length > 0 && (
                <div className="mb-8">
                  <h3 className="onyx-label mb-3">Available Options</h3>
                  <div className="flex flex-wrap gap-3">
                    {detail.variants.map((variant, index) => {
                      const isSelected = selectedVariant?._id === variant._id || selectedVariant === variant;
                      const attrs = readAttributes(variant.attributes);
                      const label = attrs.map(([k, v]) => `${k}: ${v}`).join(", ") || `Variant ${index + 1}`;
                      
                      return (
                        <button
                          key={variant._id || index}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setSelectedImage(0);
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            isSelected 
                              ? "border-[#c49a52] bg-[#c49a52]/10 text-[#c49a52]" 
                              : "border-[#1f1f1f] bg-[#0f0f13] text-[#eee9e1] hover:border-[#c49a52]/50"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extra Details for UI richness */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <h3 className="onyx-label">Availability</h3>
                  <p className="text-sm text-[#eee9e1]">{stockStatus}</p>
                </div>
                <div>
                  <h3 className="onyx-label">Shipping</h3>
                  <p className="text-sm text-[#eee9e1]">Ships in 2-3 days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-[#1f1f1f]">
              <button
                type="button"
                className="onyx-btn-secondary sm:flex-1"
              >
                ADD TO CART
              </button>
              <button type="button" className="onyx-btn-primary sm:flex-1">
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
