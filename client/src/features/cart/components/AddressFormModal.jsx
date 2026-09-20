import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const INITIAL_FORM = {
  name: "",
  phone: "",
  alternativePhone: "",
  email: "",
  addressLine: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  isDefault: false,
};

const AddressFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        phone: editData.phone || "",
        alternativePhone: editData.alternativePhone || "",
        email: editData.email || "",
        addressLine: editData.addressLine || editData.address || "",
        city: editData.city || "",
        state: editData.state || "",
        zip: editData.zip || "",
        country: editData.country || "India",
        isDefault: Boolean(editData.isDefault),
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s+-]/g, ""))) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!formData.addressLine.trim()) {
      errs.addressLine = "Street address / building details required";
    }
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state.trim()) errs.state = "State is required";
    if (!formData.zip.trim()) {
      errs.zip = "Postal / Zip code is required";
    } else if (formData.zip.trim().length < 4) {
      errs.zip = "Enter a valid postal code";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Handled by toast in hook
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with fade-in */}
      <div
        className="fixed inset-0 bg-onyx-black/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-onyx-border/80 bg-onyx-surface p-6 sm:p-8 shadow-2xl z-10 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-onyx-border/60 pb-4 mb-6">
          <div>
            <span className="onyx-eyebrow">Shipping Details</span>
            <h3 className="font-serif text-2xl font-light tracking-tight text-onyx-text">
              {editData ? "Edit Delivery Address" : "Add Delivery Address"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-onyx-border/60 text-onyx-muted transition-colors hover:border-onyx-gold hover:text-onyx-gold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="onyx-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="onyx-input"
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="onyx-label">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="onyx-input"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Row: Street Address */}
          <div>
            <label className="onyx-label">Street Address / Flat / Building *</label>
            <input
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              placeholder="House/Flat no., apartment, street, landmark"
              className="onyx-input"
            />
            {errors.addressLine && (
              <p className="mt-1 text-[11px] text-red-400">{errors.addressLine}</p>
            )}
          </div>

          {/* Row: City, State, Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="onyx-label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className="onyx-input"
              />
              {errors.city && (
                <p className="mt-1 text-[11px] text-red-400">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="onyx-label">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className="onyx-input"
              />
              {errors.state && (
                <p className="mt-1 text-[11px] text-red-400">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="onyx-label">Pincode / Zip *</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="6-digit pincode"
                className="onyx-input"
              />
              {errors.zip && (
                <p className="mt-1 text-[11px] text-red-400">{errors.zip}</p>
              )}
            </div>
          </div>

          {/* Row: Alternate Phone & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="onyx-label">Alternative Phone (Optional)</label>
              <input
                type="tel"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleChange}
                placeholder="Optional backup number"
                className="onyx-input"
              />
            </div>

            <div>
              <label className="onyx-label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="onyx-input"
              />
            </div>
          </div>

          {/* Checkbox: Make Default */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-onyx-border accent-onyx-gold cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs text-onyx-text/80 cursor-pointer select-none">
              Set as default shipping address
            </label>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-onyx-border/60">
            <button
              type="button"
              onClick={onClose}
              className="onyx-btn-secondary !w-auto px-5 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="onyx-btn-primary !w-auto px-6 py-2.5"
            >
              {isLoading ? "Saving..." : editData ? "Update Address" : "Save & Deliver Here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddressFormModal;
