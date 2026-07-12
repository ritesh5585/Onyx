import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
import { toast } from "sonner";

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
    <div className="group relative flex flex-col rounded-xl border border-onyx-border/70 bg-onyx-surface p-5 transition-colors duration-300 hover:border-onyx-gold/30">
      {/* Remove button */}
      <button
        onClick={() => onRemove(v._id)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-onyx-border/70 bg-transparent text-xs text-onyx-muted/60 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-red-400/40 hover:text-red-400"
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
            className="rounded-sm border border-onyx-border/70 bg-white/5 px-2.5 py-1 text-[11px] text-onyx-muted/80"
          >
            <span className="mr-1 text-onyx-muted/60">{key}:</span>
            {val}
          </span>
        ))}
      </div>

      {/* Stock + Price */}
      <div className="mt-auto flex items-center justify-between border-t border-onyx-border/60 pt-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              (v.stock ?? 0) > 0 ? "bg-[#81c784]" : "bg-[#e57373]"
            }`}
          />
          <span className="text-[12px] text-onyx-muted/70">
            {v.stock ?? 0} in stock
          </span>
        </div>
        {v.price?.amount && (
          <span className="font-serif text-[13px] font-medium text-onyx-gold">
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
    <div className="rounded-xl border border-onyx-border/70 bg-onyx-black/80 p-6">
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

  const detail = useSelector((state) => state.product.details);

  const {
    handleProductDetails,
    handleUpdateProduct,
    handleProductVariants,
    handleDeleteProduct,
    handleDeleteVariant,
  } = useProduct();

  useEffect(() => {
    if (productId) handleProductDetails(productId);
  }, [productId, handleProductDetails]);

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
      toast.success("Product details updated successfully.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.name.trim() || !newVariant.value.trim()) {
      toast.error("Attribute name and value are required.");
      return;
    }
    setVariantSubmitting(true);
    try {
      await handleProductVariants(productId, [newVariant]);
      setNewVariant(INITIAL_VARIANT);
      toast.success("Variant added successfully.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add variant.",
      );
    } finally {
      setVariantSubmitting(false);
    }
  };

  const onRemoveProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      await handleDeleteProduct(productId);
      toast.success("Product deleted successfully");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product.");
    }
  };

  const onRemoveVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to remove this variant?")) return;
    try {
      await handleDeleteVariant(productId, variantId);
      toast.success("Variant removed successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove variant.");
    }
  };

  if (!detail) return <Spinner />;

  return (
    <Layout showBackButton={true}>

      <div className="py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-24">

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
              <div className="flex flex-col gap-5 rounded-xl border border-onyx-gold/20 bg-onyx-surface p-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="w-full outline-none py-3 px-4 text-sm resize-none leading-relaxed border border-white/[0.08] rounded-lg bg-[#0d0d12] text-[#eee9e1] font-sans transition-all duration-300 placeholder:text-[#eee9e1]/22 hover:border-white/[0.14] focus:border-[#c49a52] focus:shadow-[0_0_0_3px_rgba(196,154,82,0.12)]"
                    disabled={saving}
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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
            <div className="border-t border-onyx-border/60 pt-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl font-light text-onyx-text">
                  Product Variants
                </h2>
                {detail.variants?.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full border border-white/10 text-[#eee9e1]/55 bg-white/5">{detail.variants.length} variants</span>
                )}
              </div>

              {detail.variants?.length > 0 ? (
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {detail.variants.map((v, i) => (
                    <VariantCard
                      key={v._id || i}
                      v={v}
                      onRemove={onRemoveVariant}
                    />
                  ))}
                </div>
              ) : (
                <p className="mb-6 text-[13px] leading-relaxed text-onyx-muted/60">
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
