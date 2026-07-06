import React from "react";

const ImageUpload = ({
  images,
  MAX_IMAGES,
  isDragging,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleImageChange,
  removeImage,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="onyx-label">Product Images</label>
        <span
          className="text-[10px] uppercase tracking-[0.16em] font-semibold"
          style={{ color: "rgba(238,233,225,0.3)" }}
        >
          {images.length} / {MAX_IMAGES}
        </span>
      </div>

      {/* Dropzone */}
      {images.length < MAX_IMAGES && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput").click()}
          role="button"
          tabIndex={0}
          aria-label="Upload product images"
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("fileInput").click()}
          className={`onyx-dropzone ${isDragging ? "active" : "inactive"}`}
        >
          <div className="w-12 h-12 border border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center bg-[#0d0d12]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(196,154,82,0.7)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm text-[rgba(238,233,225,0.55)]">
              Drop images here or{" "}
              <span className="text-[#c49a52] underline underline-offset-2">browse files</span>
            </p>
            <p className="text-[10px] text-[rgba(238,233,225,0.25)] mt-1 uppercase tracking-[0.12em]">
              JPG, PNG, WebP — up to {MAX_IMAGES} images
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {images.map((file, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#0d0d12] group border border-[rgba(255,255,255,0.07)]"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Cover badge */}
              {i === 0 && (
                <span className="absolute bottom-2 left-2 text-[9px] bg-[rgba(6,6,10,0.85)] text-[#c49a52] px-2 py-0.5 rounded-sm tracking-[0.14em] uppercase font-semibold border border-[rgba(196,154,82,0.3)]">
                  Cover
                </span>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(6,6,10,0.85)] text-[rgba(238,233,225,0.8)] flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[rgba(239,83,80,0.9)] hover:text-white border border-[rgba(255,255,255,0.1)]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-4 pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="onyx-btn-primary"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-[rgba(6,6,10,0.2)] border-t-[#06060a] animate-spin"
                style={{ animationDuration: "0.7s" }}
              />
              Publishing…
            </span>
          ) : (
            "Publish Listing"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
