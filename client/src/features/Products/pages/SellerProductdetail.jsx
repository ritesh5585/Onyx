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

/* ── Variant Card ── */
const VariantCard = ({ v, onRemove }) => {
  const attrs = readAttributes(v.attributes);
  return (
    <div className="relative flex flex-col p-5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0d0d12] transition-colors duration-300 hover:border-[rgba(196,154,82,0.3)] group">
      {/* Remove button */}
      <button
        onClick={() => onRemove(v._id)}
        className="absolute top-3 right-3 w-6 h-6 rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent text-[rgba(238,233,225,0.3)] flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-[rgba(239,83,80,0.4)] hover:text-[#e57373]"
        aria-label="Remove variant"
        title="Remove variant"
      >
        ✕
      </button>

      {/* Attribute chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {attrs.map(([key, val]) => (
          <span
            key={key}
            className="px-2.5 py-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm text-[11px] text-[rgba(238,233,225,0.8)]"
          >
            <span className="text-[rgba(238,233,225,0.4)] mr-1">{key}:</span>
            {val}
          </span>
        ))}
      </div>

      {/* Stock + Price */}
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              (v.stock ?? 0) > 0 ? "bg-[#81c784]" : "bg-[#e57373]"
            }`}
          />
          <span className="text-[12px] text-[rgba(238,233,225,0.45)]">
            {v.stock ?? 0} in stock
          </span>
        </div>
        {v.price?.amount && (
          <span
            className="text-[13px] font-medium text-[#c49a52]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {v.price.currency} {v.price.amount.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Add Variant Form ── */
const AddVariantForm = ({ newVariant, onChange, onAdd, isSubmitting }) => {
  const fields = [
    { key: "name", placeholder: "Attribute (e.g. Size)", type: "text" },
    { key: "value", placeholder: "Value (e.g. Medium)", type: "text" },
    { key: "stock", placeholder: "Stock quantity", type: "number" },
    { key: "extraPrice", placeholder: "Extra price (optional)", type: "number" },
  ];

  return (
    <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a10]">
      <h3 className="onyx-label mb-5">Add New Variant</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {fields.map(({ key, placeholder, type }) => (
          <input
            key={key}
            type={type}
            name={key}
            placeholder={placeholder}
            value={newVariant[key]}
            onChange={onChange}
            disabled={isSubmitting}
            className="onyx-input"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={isSubmitting}
        className="onyx-btn-secondary w-full"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
            Adding…
          </span>
        ) : (
          "+ Add Variant"
        )}
      </button>
    </div>
  );
};

/* ════════════════════════════════════
   SELLER PRODUCT DETAIL PAGE
════════════════════════════════════ */
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
    return ["https://placehold.co/600x800/0d0d12/eee9e1?text=No+Image"];
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

  const onRemoveProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await handleDeleteProduct(productId);
      showToast("Product deleted successfully");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete product.", "error");
    }
  };

  const onRemoveVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to remove this variant?")) return;
    try {
      await handleDeleteVariant(productId, variantId);
      showToast("Variant removed successfully");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to remove variant.", "error");
    }
  };

  if (!detail) return <Spinner />;

  return (
    <Layout showBackButton={true}>
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">

          {/* ── Image Gallery ── */}
          <ImageGallery
            mainImage={mainImage}
            imageUrls={imageUrls}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            title={detail.title}
          />

          {/* ── Details + Variants ── */}
          <div className="flex flex-col gap-8">

            {/* ─ View / Edit Info ─ */}
            {isEditing ? (
              <div className="flex flex-col gap-5 p-6 rounded-xl border border-[rgba(196,154,82,0.2)] bg-[#0d0d12]">
                <p className="onyx-eyebrow">Editing Product</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
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
                  <div>
                    <label className="onyx-label">Currency</label>
                    <select
                      name="priceCurrency"
                      value={editForm.priceCurrency}
                      onChange={(e) => handleInputChange(e, setEditForm)}
                      className="onyx-input"
                      disabled={saving}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0d0d12]">{c}</option>
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
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-[rgba(6,6,10,0.3)] border-t-[#06060a] animate-spin" />
                        Saving…
                      </span>
                    ) : "Save Changes"}
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
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[12px] font-semibold text-[#c49a52] uppercase tracking-[0.1em] hover:opacity-75 transition-opacity"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onRemoveProduct}
                    className="text-[12px] font-semibold text-[#e57373] uppercase tracking-[0.1em] hover:opacity-75 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </ProductOverview>
            )}

            {/* ─ Variants Section ─ */}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-light text-[#eee9e1]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Product Variants
                </h2>
                {detail.variants?.length > 0 && (
                  <span className="onyx-tag">{detail.variants.length} variants</span>
                )}
              </div>

              {detail.variants?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {detail.variants.map((v, i) => (
                    <VariantCard
                      key={v._id || i}
                      v={v}
                      onRemove={onRemoveVariant}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] leading-relaxed text-[rgba(238,233,225,0.35)] mb-6">
                  No variants yet. Add sizes, colors, or materials below.
                </p>
              )}

              <AddVariantForm
                newVariant={newVariant}
                onChange={(e) => handleInputChange(e, setNewVariant)}
                onAdd={handleAddVariant}
                isSubmitting={variantSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerProductdetail;
