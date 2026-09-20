import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import { useAddress } from "../hooks/useAddress";
import Layout from "../../Shared/Layout";
import EmptyState from "../../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import CartItems from "../components/CartItems";
import AddressSection from "../components/AddressSection";

const Cart = () => {
  const navigate = useNavigate();
  const addressSectionRef = useRef(null);

  const cartData = useSelector((state) => state.cart.items) || {};
  const cartItems = cartData.items || [];
  const subtotal = cartData.subtotal ?? 0;
  const totalPrice = cartData.totalPrice ?? subtotal;
  const currency = cartData.currency ?? "INR";

  const {
    handleGetCart,
    handleRemoveItem,
    handleIncrementQty,
    handleDecrementQty,
  } = useCart();

  const {
    addresses,
    selectedAddress,
    isLoading: isAddressLoading,
    saveAddress,
    updateAddressItem,
    removeAddress,
    makeDefault,
    selectAddress,
  } = useAddress();

  useEffect(() => {
    handleGetCart().catch(() => {
      // ignore initial fetch errors
    });
  }, [handleGetCart]);

  const isEmpty = cartItems.length === 0;

  const scrollToAddress = () => {
    addressSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <Layout showBackButton={true}>
      <div className="min-h-[60vh] pb-24 pt-8">
        <div className="mb-8 sm:mb-10 border-b border-onyx-border/70 pb-6 sm:pb-8">
          <p className="onyx-eyebrow mb-3">Shopping Bag</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-onyx-text">
            Your Cart
          </h1>
          <div className="onyx-divider" />
          {!isEmpty && (
            <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-onyx-muted/70">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        {isEmpty ? (
          <EmptyState
            icon="🛒"
            eyebrow="Empty Cart"
            title="Your cart is waiting to be filled."
            body="Browse our curated collection and discover your next piece."
            cta={{ label: "Explore Collection", to: "/" }}
          />
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] lg:gap-12">
            {/* Left Column: Items list & Address Selection */}
            <div className="flex flex-col min-w-0 space-y-8">
              {/* Bag Items */}
              <div className="flex flex-col divide-y divide-onyx-border/40">
                {cartItems.map((item, i) => (
                  <CartItems
                    key={item._id || i}
                    item={item}
                    navigate={navigate}
                    onIncrementQty={handleIncrementQty}
                    onDecrementQty={handleDecrementQty}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Delivery Address Section (Step 1 of Checkout) */}
              <div ref={addressSectionRef} className="pt-2">
                <AddressSection
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onSelectAddress={selectAddress}
                  onSaveAddress={saveAddress}
                  onUpdateAddress={updateAddressItem}
                  onDeleteAddress={removeAddress}
                  onSetDefaultAddress={makeDefault}
                  isLoading={isAddressLoading}
                />
              </div>
            </div>

            {/* Right Column: Sticky Summary & Checkout Action */}
            <div className="lg:sticky lg:top-20">
              <OrderSummary
                count={cartItems.length}
                subtotal={subtotal}
                shipping={0}
                total={totalPrice}
                currency={currency}
                selectedAddress={selectedAddress}
                onPromptAddress={scrollToAddress}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
