import React from "react";

// A reusable Image Gallery component for product pages
const ImageGallery = ({ mainImage, imageUrls, selectedImage, setSelectedImage, title }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="w-full aspect-[4/5] bg-[#0f0f13] rounded-xl overflow-hidden flex items-center justify-center border border-[#1f1f1f]">
        <img
          src={mainImage}
          alt={title || "Product Image"}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnail Images List */}
      {imageUrls?.length > 1 && (
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
                alt={`${title || "Product"} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
