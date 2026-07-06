import React from "react";

const ImageGallery = ({
  mainImage,
  imageUrls,
  selectedImage,
  setSelectedImage,
  title,
}) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-5">
      {/* ── Thumbnail Strip (left vertical on desktop) ── */}
      {imageUrls?.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-1 lg:pb-0 lg:max-h-[600px] flex-shrink-0">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`flex-shrink-0 w-[68px] h-[85px] lg:w-[72px] lg:h-[90px] bg-[#0d0d12] overflow-hidden border transition-all duration-300 outline-none rounded-sm ${
                selectedImage === idx
                  ? "border-[#c49a52] opacity-100"
                  : "border-[rgba(255,255,255,0.07)] opacity-55 hover:opacity-100 hover:border-[rgba(255,255,255,0.2)]"
              }`}
            >
              <img
                src={url}
                alt={`${title || "Product"} — view ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main Image ── */}
      <div className="flex-1 aspect-[4/5] bg-[#0d0d12] overflow-hidden border border-[rgba(255,255,255,0.06)] relative group rounded-sm">
        <img
          src={mainImage}
          alt={title || "Product Image"}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        {/* Subtle zoom indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[rgba(6,6,10,0.7)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            <span className="text-[9px] uppercase tracking-[0.1em] text-[rgba(238,233,225,0.6)]">
              Zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
