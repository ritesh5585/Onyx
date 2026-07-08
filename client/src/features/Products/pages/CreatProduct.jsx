import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import ImageUpload from "../components/imageUpload";
import Price from "../components/Price";
import Layout from "../../Shared/Layout";

const MAX_IMAGES = 7;
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const INITIAL_FORM = {
  title: "",
  description: "",
  priceAmount: "",
  priceCurrency: "INR",
};

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

  return (
    <Layout showBackButton={true}>
      <div className="py-10 max-w-5xl">
        {/* ── Header ── */}
        <div className="mb-10 border-b border-onyx-border/70 pb-8">
          <p className="onyx-eyebrow mb-3">Seller Portal</p>
          <h1 className="onyx-page-title">New Listing</h1>
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
            {/* ── LEFT — Text fields ── */}
            <div className="flex flex-col gap-7">
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
                  className="onyx-input"
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
                  rows={7}
                  className="onyx-textarea"
                />
              </div>

              <Price
                formData={formData}
                handleChange={handleChange}
                CURRENCIES={CURRENCIES}
              />

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

            {/* ── RIGHT — Image upload + submit ── */}
            <div className="lg:sticky lg:top-24">
              <ImageUpload
                images={images}
                MAX_IMAGES={MAX_IMAGES}
                isDragging={isDragging}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProduct;
