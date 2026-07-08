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
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-onyx-muted/60">
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-onyx-border/70 bg-onyx-surface">
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
            <p className="text-sm text-onyx-muted">
              Drop images here or{" "}
              <span className="text-onyx-gold underline underline-offset-2">browse files</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-onyx-muted/50">
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
              className="group relative aspect-square overflow-hidden rounded-lg border border-onyx-border/70 bg-onyx-surface"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Cover badge */}
              {i === 0 && (
                <span className="absolute bottom-2 left-2 rounded-sm border border-onyx-gold/30 bg-onyx-black/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-onyx-gold">
                  Cover
                </span>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-onyx-border/70 bg-onyx-black/85 text-xs text-onyx-muted/80 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/90 hover:text-white"
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
              <span className="h-4 w-4 animate-[spin_0.7s_linear_infinite] rounded-full border border-onyx-black/20 border-t-onyx-black" />
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
