import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";

const SellerProductdetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });

  // Variants State
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ name: "", value: "", extraPrice: "", stock: "" });

  const detail = useSelector((state) => state.product.details);
  const { handleProductDetails } = useProduct();

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (detail) {
      setEditForm({
        title: detail.title || "",
        description: detail.description || "",
        priceAmount: detail.price?.amount || "",
        priceCurrency: detail.price?.currency || "INR"
      });
      // Pre-load variants if they exist in the product payload
      setVariants(detail.variants || []);
    }
  }, [detail]);

  if (!detail) return <Spinner />;

  const imageUrls =
    detail.images && detail.images.length > 0
      ? detail.images.map((img) => img.url)
      : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];

  const mainImage = imageUrls[selectedImage] || imageUrls[0];

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = () => {
    // TODO: Connect to backend API to update product details
    console.log("Saving details:", editForm);
    setIsEditing(false);
  };

  const handleAddVariant = () => {
    if (!newVariant.name || !newVariant.value) return;
    setVariants((prev) => [...prev, newVariant]);
    setNewVariant({ name: "", value: "", extraPrice: "", stock: "" });
  };

  return (
    <Layout showBackButton={true}>
      <div className="py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-[#0f0f13] rounded-xl overflow-hidden flex items-center justify-center border border-[#1f1f1f]">
              <img
                src={mainImage}
                alt={detail.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
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

          {/* RIGHT: Product Details & Customization */}
          <div className="flex flex-col">
            
            {/* View vs Edit Toggle */}
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
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="onyx-label">Price (Amount)</label>
                    <input
                      type="number"
                      name="priceAmount"
                      value={editForm.priceAmount}
                      onChange={handleEditChange}
                      className="onyx-input"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="onyx-label">Currency</label>
                    <select
                      name="priceCurrency"
                      value={editForm.priceCurrency}
                      onChange={handleEditChange}
                      className="onyx-input"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
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
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button onClick={() => setIsEditing(false)} className="onyx-btn-secondary sm:flex-1">Cancel</button>
                  <button onClick={handleSaveDetails} className="onyx-btn-primary sm:flex-1">Save Changes</button>
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
                <div
                  className="text-2xl font-semibold tracking-wide text-[#c49a52] mt-4 mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {detail.price?.currency || "INR"} {detail.price?.amount?.toLocaleString() || "0"}
                </div>
                
                <div className="onyx-divider" />
                
                <div className="mt-8 mb-10">
                  <h3 className="onyx-label">Description</h3>
                  <p className="text-sm md:text-base leading-relaxed text-[#a09d98] whitespace-pre-line">
                    {detail.description}
                  </p>
                </div>
              </>
            )}

            {/* Variants Management Section */}
            <div className="mt-auto pt-8 border-t border-[#1f1f1f]">
              <h2 className="text-xl font-semibold text-[#eee9e1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Product Variants
              </h2>
              
              {/* Existing Variants */}
              {variants.length > 0 ? (
                <div className="flex flex-col gap-3 mb-8">
                  {variants.map((v, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#0f0f13] p-4 rounded-lg border border-[#1f1f1f]">
                      <div>
                        <span className="font-semibold text-[#eee9e1] mr-2">{v.name}:</span>
                        <span className="text-[#a09d98]">{v.value}</span>
                      </div>
                      <div className="text-sm flex gap-6">
                        <span><span className="text-[#a09d98]">Stock:</span> {v.stock || "N/A"}</span>
                        {v.extraPrice && <span className="text-[#c49a52]">+{v.extraPrice}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#a09d98] mb-8">No variants added yet. Add sizes, colors, or materials below.</p>
              )}

              {/* Add Variant Form */}
              <div className="bg-[#0b0b0d] p-6 rounded-xl border border-[#1f1f1f]">
                <h3 className="onyx-label mb-4">Add New Variant</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Name (e.g. Size, Color)"
                      value={newVariant.name}
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      className="onyx-input"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Value (e.g. Medium, Red)"
                      value={newVariant.value}
                      onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
                      className="onyx-input"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                      className="onyx-input"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Price Adjustment (optional)"
                      value={newVariant.extraPrice}
                      onChange={(e) => setNewVariant({ ...newVariant, extraPrice: e.target.value })}
                      className="onyx-input"
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddVariant} 
                  className="onyx-btn-secondary"
                >
                  + Add Variant
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