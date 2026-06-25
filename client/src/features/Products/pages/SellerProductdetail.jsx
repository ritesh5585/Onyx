import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";

// Shared Reusable Components
import ImageGallery from "../components/ImageGallery";
import ProductOverview from "../components/ProductOverview";
import { readAttributes } from "../utils/variantUtils";

const INITIAL_VARIANT = { name: "", value: "", extraPrice: "", stock: "" };
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

const SellerProductdetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [saving, setSaving] = useState(false);
  const [newVariant, setNewVariant] = useState(INITIAL_VARIANT);
  const [variantSubmitting, setVariantSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const detail = useSelector((state) => state.product.details);

  const {
    handleProductDetails,
    handleUpdateProduct,
    handleProductVariants,
    handleDeleteProduct,
    handleDeleteVariant,
  } = useProduct();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    if (productId) handleProductDetails(productId);
  }, [productId]);

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

  const imageUrls = useMemo(() => {
    if (detail?.images?.length > 0) return detail.images.map((img) => img.url);
    return ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];
  }, [detail]);

  const mainImage = imageUrls[selectedImage] ?? imageUrls[0];

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await handleUpdateProduct(productId, editForm);
      setIsEditing(false);
      showToast("Product details updated successfully.");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to update product.",
        "error",
      );
    } finally {
      setSaving(false);
    }
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
      showToast(
        err?.response?.data?.message || "Failed to add variant.",
        "error",
      );
    } finally {
      setVariantSubmitting(false);
    }
  };

  if (!detail) return <Spinner />;

  return (
    <Layout showBackButton={true}>
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Image Gallery Component ── */}
          <ImageGallery
            mainImage={mainImage}
            imageUrls={imageUrls}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            title={detail.title}
          />

          {/* ── Details + Variants ── */}
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
                    onChange={(e) => handleInputChange(e, setEditForm)}
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
                      onChange={(e) => handleInputChange(e, setEditForm)}
                      className="onyx-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="onyx-label">Currency</label>
                    <select
                      name="priceCurrency"
                      value={editForm.priceCurrency}
                      onChange={(e) => handleInputChange(e, setEditForm)}
                      className="onyx-input"
                      disabled={saving}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="onyx-label">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={(e) => handleInputChange(e, setEditForm)}
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
              <ProductOverview
                title={detail.title}
                priceAmount={detail.price?.amount}
                priceCurrency={detail.price?.currency}
                description={detail.description}
              >
                <div className="flex flex-col items-start gap-2 ml-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-[#c49a52] hover:underline whitespace-nowrap transition-colors"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={onRemoveProduct}
                    className="text-sm font-semibold text-red-500 hover:underline whitespace-nowrap transition-colors"
                  >
                    Remove Product
                  </button>
                </div>
              </ProductOverview>
            )}

            {/* ─ Variants Section ─ */}
            <div className="mt-auto pt-8 border-t border-[#1f1f1f]">
              <h2 className="text-xl font-semibold mb-6 text-[#eee9e1] font-['Playfair_Display',Georgia,serif]">
                Product Variants
              </h2>

              {detail.variants?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {detail.variants.map((v, i) => (
                    <div
                      key={v._id || i}
                      className="relative flex flex-col p-5 rounded-xl border bg-[#0f0f13] border-[#1f1f1f] shadow-sm hover:border-[#c49a52]/50 transition-colors"
                    >
                      <button
                        onClick={() => onRemoveVariant(v._id)}
                        className="absolute top-2 right-2 text-[#a09d98] hover:text-red-500 text-xl leading-none p-1 transition-colors z-10 font-bold"
                        title="Remove Variant"
                      >
                        &times;
                      </button>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {readAttributes(v.attributes).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-3 py-1 bg-[#1f1f1f] rounded-md text-sm text-[#eee9e1]"
                          >
                            <span className="text-[#a09d98] mr-1">{key}:</span>{" "}
                            {val}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-auto border-t border-[#1f1f1f] pt-3">
                        <span className="text-sm text-[#a09d98]">
                          Stock:{" "}
                          <strong className="text-[#eee9e1]">
                            {v.stock ?? "—"}
                          </strong>
                        </span>
                        {v.price?.amount && (
                          <span className="text-sm font-medium text-[#c49a52]">
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
                  {["name", "value", "stock", "extraPrice"].map((field) => (
                    <div key={field}>
                      <input
                        type={
                          field === "stock" || field === "extraPrice"
                            ? "number"
                            : "text"
                        }
                        name={field}
                        placeholder={
                          field === "name"
                            ? "Attribute (e.g. Size)"
                            : field === "value"
                              ? "Value (e.g. Medium)"
                              : field === "stock"
                                ? "Stock Quantity"
                                : "Price for this variant (optional)"
                        }
                        value={newVariant[field]}
                        onChange={(e) => handleInputChange(e, setNewVariant)}
                        className="onyx-input"
                        disabled={variantSubmitting}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="onyx-btn-secondary w-full"
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
