import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import Layout from "../../Shared/Layout";

const MAX_IMAGES = 7;
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const INITIAL_FORM = {
  title: "",
  description: "",
  priceAmount: "",
  priceCurrency: "INR",
};

/* Underline-only field, shared by title / description / price / currency —
   matches the reference's "no boxed input, gold underline on focus" pattern */
const fieldClass =
  "w-full bg-transparent border-0 border-b border-onyx-border py-3 text-sm text-onyx-text " +
  "placeholder:text-onyx-muted2 outline-none transition-colors duration-300 " +
  "focus:border-onyx-gold focus:shadow-[0_1px_0_0_var(--color-onyx-gold)]";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles],
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) {
      setError("Upload at least one image before publishing.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      images.forEach((file) => data.append("images", file));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      setError("Failed to publish listing. Please try again.");
      console.error("Create product failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const atLimit = images.length >= MAX_IMAGES;

  const PublishButton = ({ className = "" }) => (
    <button
      type="submit"
      form="cp-form"
      disabled={isSubmitting}
      className={`onyx-btn-primary flex-1 !py-3 sm:!py-3.5 text-[11px] sm:text-[12px] ${className}`}
    >
      {isSubmitting ? "Publishing…" : "Publish Listing"}
    </button>
  );

  return (
    <Layout showBackButton={true}>
      <div className="py-8 sm:py-10 max-w-5xl">
        {/* ── Header ── */}
        <div className="mb-8 sm:mb-10 border-b border-onyx-border/70 pb-7 sm:pb-8">
          <p className="onyx-eyebrow mb-3">Seller Portal</p>
          <h1 className="onyx-page-title !mb-0">New Listing</h1>
          <div className="onyx-divider" />
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            className="mb-8 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-950/40 px-5 py-4 text-[13px] text-red-400"
            role="alert"
          >
            <span className="text-base flex-shrink-0">✕</span>
            {error}
          </div>
        )}

        <form id="cp-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
            {/* ── FIELDS — shows second on mobile (image-first), first on desktop ── */}
            <div className="order-2 flex flex-col gap-8 lg:order-1">
              <div>
                <label className="onyx-label" htmlFor="cp-title">
                  Product Title
                </label>
                <input
                  id="cp-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Oversized Cashmere Coat"
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="onyx-label" htmlFor="cp-desc">
                  Description
                </label>
                <textarea
                  id="cp-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product — material, fit, silhouette, care instructions…"
                  rows={5}
                  className={`${fieldClass} resize-none leading-relaxed`}
                />
              </div>

              <div>
                <label className="onyx-label">Pricing</label>
                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <input
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className={fieldClass}
                  />
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className={`${fieldClass} text-onyx-gold`}
                  >
                    {CURRENCIES.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="bg-onyx-card text-onyx-text"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-xl border border-onyx-border/70 bg-onyx-surface p-5">
                <p className="onyx-label mb-3">Listing Tips</p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Use clean, well-lit photography on neutral backgrounds.",
                    "Mention material composition and care instructions.",
                    "Add multiple size/color variants after publishing.",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[12px] leading-relaxed text-onyx-muted/70"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-onyx-gold">
                        —
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── IMAGES — shows first on mobile, second on desktop ── */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="mb-3 flex items-center justify-between">
                <p className="onyx-label !mb-0">Product Images</p>
                <span className="text-[11px] uppercase tracking-[0.14em] text-onyx-muted2">
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>

              {images.length > 0 && (
                <div className="mb-5 grid grid-cols-4 gap-2.5">
                  {images.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="relative aspect-square overflow-hidden rounded-sm border border-onyx-border"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-onyx-black/80 text-[9px] text-onyx-text transition-colors hover:bg-onyx-gold hover:text-onyx-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!atLimit && (
                <label
                  htmlFor="cp-image-input"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`mb-6 flex h-[220px] lg:h-[300px] cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border border-dashed text-center transition-colors duration-300 ${
                    isDragging
                      ? "border-onyx-gold bg-onyx-gold/5"
                      : "border-onyx-border-hover"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-onyx-gold text-onyx-gold">
                    ↑
                  </span>
                  <span className="text-[13px] text-onyx-text">
                    Drop images here or{" "}
                    <span className="text-onyx-gold underline">
                      browse files
                    </span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-onyx-muted2">
                    JPG, PNG, WEBP — up to {MAX_IMAGES} images
                  </span>
                  <input
                    id="cp-image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              )}

              {/* Desktop publish button — inline at the bottom of this column */}
              <PublishButton className="hidden lg:!inline-flex" />
            </div>
          </div>
        </form>
      </div>

      {/* Mobile sticky publish bar — thumb-reachable action */}
      {createPortal(
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-onyx-border/70 bg-onyx-black/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <PublishButton className="w-full" />
        </div>,
        document.body
      )}
      {/* spacer so the sticky bar never covers the last field on mobile */}
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default CreateProduct;
