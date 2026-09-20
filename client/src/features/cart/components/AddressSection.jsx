import React, { useState } from "react";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";

const AddressSection = ({
  addresses = [],
  selectedAddress = null,
  onSelectAddress,
  onSaveAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  isLoading = false,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingAddress) {
      await onUpdateAddress(editingAddress._id, formData);
    } else {
      await onSaveAddress(formData);
    }
  };

  return (
    <section className="rounded-2xl border border-onyx-border/70 bg-onyx-surface p-5 sm:p-7 transition-all duration-300">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-onyx-border/60 pb-4 mb-5">
        <div>
          <span className="onyx-eyebrow">Step 1</span>
          <h2 className="font-serif text-xl sm:text-2xl font-light tracking-tight text-onyx-text flex items-center gap-2">
            <span>Delivery Address</span>
            {selectedAddress && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                <span>✓</span>
                <span>Selected</span>
              </span>
            )}
          </h2>
        </div>

        {addresses.length > 0 && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-onyx-gold hover:text-onyx-gold-lt transition-colors"
          >
            <span>+</span>
            <span>Add New</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {addresses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl border border-dashed border-onyx-border/80 bg-white/[0.02]">
          <span className="text-3xl mb-2">📍</span>
          <p className="font-serif text-lg text-onyx-text font-light">
            No delivery address found
          </p>
          <p className="mt-1 text-xs text-onyx-muted max-w-sm mb-5">
            Add a shipping address to calculate taxes, check delivery availability, and proceed to checkout.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="onyx-btn-primary !w-auto px-6 py-2.5 text-xs"
          >
            + Add Delivery Address
          </button>
        </div>
      ) : (
        /* Addresses View */
        <div className="space-y-4">
          {/* Active / Primary Selected Card Preview */}
          {selectedAddress && !isExpanded ? (
            <div>
              <AddressCard
                address={selectedAddress}
                isSelected={true}
                onSelect={() => {}}
                onEdit={handleOpenEdit}
                onDelete={onDeleteAddress}
                onSetDefault={onSetDefaultAddress}
              />

              {addresses.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="text-xs text-onyx-gold hover:underline tracking-wide font-medium flex items-center gap-1"
                  >
                    <span>Change address ({addresses.length - 1} other saved)</span>
                    <span>↓</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Expanded List of all Addresses */
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    isSelected={selectedAddress?._id === addr._id}
                    onSelect={(chosen) => {
                      onSelectAddress(chosen);
                      setIsExpanded(false);
                    }}
                    onEdit={handleOpenEdit}
                    onDelete={onDeleteAddress}
                    onSetDefault={onSetDefaultAddress}
                  />
                ))}
              </div>

              {selectedAddress && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-xs text-onyx-muted hover:text-onyx-text flex items-center gap-1"
                  >
                    <span>Collapse list</span>
                    <span>↑</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <AddressFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editData={editingAddress}
        isLoading={isLoading}
      />
    </section>
  );
};

export default AddressSection;
