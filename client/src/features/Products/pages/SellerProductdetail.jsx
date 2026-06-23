import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";

/* ─── helpers ─── */

const INITIAL_VARIANT = { name: "", value: "", extraPrice: "", stock: "" };

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

/** Safely read a Mongoose Map or plain object into [key, value] pairs. */
const readAttributes = (attrs) => {
  if (!attrs) return [];
  if (typeof attrs.entries === "function") return Array.from(attrs.entries());
  return Object.entries(attrs);
};

/* ════════════════════════════════════════════
   SellerProductdetail
════════════════════════════════════════════ */
const SellerProductdetail = () => {
  const { productId } = useParams();

  /* image gallery */
  const [selectedImage, setSelectedImage] = useState(0);

  /* edit-info form */
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [saving, setSaving] = useState(false);

  /* add-variant form */
  const [newVariant, setNewVariant] = useState(INITIAL_VARIANT);
  const [variantSubmitting, setVariantSubmitting] = useState(false);

  /* toast */
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* redux + hook */
  const detail = useSelector((state) => state.product.details);
  const { handleProductDetails, handleUpdateProduct, handleProductVariants } =
    useProduct();

  useEffect(() => {
    if (productId) handleProductDetails(productId);
  }, [productId]);

  /* sync edit form when product loads */
  useEffect(() => {
    if (detail) {
      setEditForm({
        title: detail.title || "",
        description: detail.description || "",
        priceAmount: detail.price?.amount || "",
        priceCurrency: detail.price?.currency || "INR",
      });
    }
  }, [detail]);

  if (!detail) return <Spinner />;

  /* derived */
  const imageUrls =
    detail.images?.length > 0
      ? detail.images.map((img) => img.url)
      : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];

  const mainImage = imageUrls[selectedImage] ?? imageUrls[0];

  /* ── handlers ── */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await handleUpdateProduct(productId, editForm);
      setIsEditing(false);
      showToast("Product details updated successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update product.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariant = async () => {
    if (!newVariant.name.trim() || !newVariant.value.trim()) {
      showToast("Attribute name and value are required.", "error");
      return;
    }
    setVariantSubmitting(true);
    try {
      await handleProductVariants(productId, [newVariant]);
      setNewVariant(INITIAL_VARIANT);
      showToast("Variant added successfully.");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to add variant.", "error");
    } finally {
      setVariantSubmitting(false);
    }
  };

  /* ════════════════════════════════════════════
     Render
  ════════════════════════════════════════════ */
  return (
    <Layout showBackButton={true}>
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ══ LEFT: Image Gallery ══ */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-[#0f0f13] rounded-xl overflow-hidden flex items-center justify-center border border-[#1f1f1f]">
              <img
                src={mainImage}
                alt={detail.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
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

          {/* ══ RIGHT: Details + Variants ══ */}
          <div className="flex flex-col">

            {/* ─ Edit / View Info ─ */}
            {isEditing ? (
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="onyx-label">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="onyx-input"
                    disabled={saving}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="onyx-label">Price</label>
                    <input
                      type="number"
                      name="priceAmount"
                      value={editForm.priceAmount}
                      onChange={handleEditChange}
                      className="onyx-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="onyx-label">Currency</label>
                    <select
                      name="priceCurrency"
                      value={editForm.priceCurrency}
                      onChange={handleEditChange}
                      className="onyx-input"
                      disabled={saving}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="onyx-label">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={5}
                    className="onyx-textarea"
                    disabled={saving}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="onyx-btn-secondary sm:flex-1"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    className="onyx-btn-primary sm:flex-1"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="onyx-page-title">{detail.title}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-[#c49a52] hover:underline whitespace-nowrap ml-4 transition-colors"
                  >
                    Edit Details
                  </button>
                </div>

                <p className="text-2xl font-semibold tracking-wide text-[#c49a52] mt-4 mb-6 font-['Inter',system-ui,sans-serif]">
                  {detail.price?.currency || "INR"}{" "}
                  {detail.price?.amount?.toLocaleString() || "0"}
                </p>

                <div className="onyx-divider" />

                <div className="mt-8 mb-10">
                  <h3 className="onyx-label">Description</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line">{detail.description}</p>
                </div>
              </>
            )}

            {/* ─ Variants Section ─ */}
            <div className="mt-auto pt-8 border-t border-[#1f1f1f]">
              <h2 className="text-xl font-semibold mb-6 text-[#eee9e1] font-['Playfair_Display',Georgia,serif]">Product Variants</h2>

              {/* Existing variants */}
              {detail.variants?.length > 0 ? (
                <div className="flex flex-col gap-3 mb-8">
                  {detail.variants.map((v, i) => (
                    <div key={v._id || i} className="flex justify-between items-center p-4 rounded-lg border bg-[#0f0f13] border-[#1f1f1f]">
                      <div className="flex flex-wrap gap-2">
                        {readAttributes(v.attributes).map(([key, val]) => (
                          <span key={key}>
                            <span className="font-semibold mr-1 text-[#eee9e1]">{key}:</span>
                            <span className="text-[#a09d98]">{val}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-6 ml-4 shrink-0">
                        <span className="text-sm text-[#a09d98]">
                          Stock: {v.stock ?? "—"}
                        </span>
                        {v.price?.amount && (
                          <span className="text-sm text-[#c49a52]">
                            {v.price.currency} {v.price.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-[#a09d98] mb-8">
                  No variants yet. Add sizes, colors, or materials below.
                </p>
              )}

              {/* Add Variant Form */}
              <div className="p-6 rounded-xl border bg-[#0b0b0d] border-[#1f1f1f]">
                <h3 className="onyx-label mb-4">Add New Variant</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <input
                      id="variant-name"
                      type="text"
                      name="name"
                      placeholder="Attribute (e.g. Size, Color)"
                      value={newVariant.name}
                      onChange={handleVariantChange}
                      className="onyx-input"
                      disabled={variantSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      id="variant-value"
                      type="text"
                      name="value"
                      placeholder="Value (e.g. Medium, Red)"
                      value={newVariant.value}
                      onChange={handleVariantChange}
                      className="onyx-input"
                      disabled={variantSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      id="variant-stock"
                      type="number"
                      name="stock"
                      placeholder="Stock Quantity"
                      value={newVariant.stock}
                      onChange={handleVariantChange}
                      className="onyx-input"
                      disabled={variantSubmitting}
                    />
                  </div>
                  <div>
                    <input
                      id="variant-price"
                      type="number"
                      name="extraPrice"
                      placeholder="Price for this variant (optional)"
                      value={newVariant.extraPrice}
                      onChange={handleVariantChange}
                      className="onyx-input"
                      disabled={variantSubmitting}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  id="add-variant-btn"
                  onClick={handleAddVariant}
                  className="onyx-btn-secondary"
                  disabled={variantSubmitting}
                >
                  {variantSubmitting ? "Adding…" : "+ Add Variant"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProductdetail;
