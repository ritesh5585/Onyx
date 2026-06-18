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
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="onyx-label">Images</label>
        <span className="text-xs text-[#555]">
          {images.length}/{MAX_IMAGES}
        </span>
      </div>

      {images.length < MAX_IMAGES && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput").click()}
          className={`onyx-dropzone ${isDragging ? "active" : "inactive"} ${images.length > 0 ? "mb-4" : ""}`}
        >
          <div className="w-11 h-11 border border-[#2a2a2a] rounded-lg flex items-center justify-center bg-[#161616]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-sm text-[#aaa] text-center">
            Drop images here or{" "}
            <span className="text-[#c49a52] underline">tap to upload</span>
          </p>
          <p className="text-[11px] text-[#444] tracking-[0.08em] uppercase">
            Up to {MAX_IMAGES} images
          </p>
        </div>
      )}

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((file, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] group"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/70 text-[#c49a52] px-2 py-0.5 rounded tracking-wider">
                  COVER
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/65 text-white flex items-center justify-center text-xs hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8.5 border-t border-[#1a1a1a] pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="onyx-btn-primary"
        >
          {isSubmitting ? "Publishing..." : "Publish Listing"}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
