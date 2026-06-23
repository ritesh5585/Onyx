import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const detail = useSelector((state) => state.product.details);

  const { handleProductDetails } = useProduct();

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  if (!detail) {
    return (
      <Spinner />
      // <div className="onyx-bg min-h-screen flex items-center justify-center">
      // </div>
    );
  }

  const imageUrls =
    detail.images && detail.images.length > 0
      ? detail.images.map((img) => img.url)
      : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];

  const mainImage = imageUrls[selectedImage] || imageUrls[0];

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
              {detail.price?.currency || "INR"}{" "}
              {detail.price?.amount?.toLocaleString() || "0"}
            </p>

            <div className="onyx-divider" />

            <div className="flex-grow">
              <h3 className="onyx-label">Description</h3>
              <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line mb-8">
                {detail.description}
              </p>

              {/* Extra Details for UI richness */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <h3 className="onyx-label">Availability</h3>
                  <p className="text-sm text-[#eee9e1]">In Stock</p>
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
