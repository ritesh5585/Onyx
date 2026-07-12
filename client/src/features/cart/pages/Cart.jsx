import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useCart } from "../hooks/useCart";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";
import EmptyState from "../../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import CartItems from "../components/CartItems";

const EMPTY_CART = [];

//
// Main Cart Page
//
const Cart = () => {
  const navigate = useNavigate();
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

  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, visible: true });
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  useEffect(() => {
    handleGetCart().catch(() => {
      // ignore initial fetch errors
    });
  }, [handleGetCart]);

  const isEmpty = cartItems.length === 0;

  return (
    <>
      {toast.visible && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast((p) => ({ ...p, visible: false }))}
        />
      )}

      <Layout showBackButton={true}>
        <div className="min-h-[60vh] pb-24 pt-8">
          {/* ── Header ── */}
          <div className="mb-10 border-b border-onyx-border/70 pb-8">
            <p className="onyx-eyebrow mb-3">Shopping Bag</p>
            <h1 className="onyx-page-title">Your Cart</h1>
            <div className="onyx-divider" />
            {!isEmpty && (
              <span className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em] text-onyx-muted/70">
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
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
              {/* Items list */}
              <div className="flex flex-col">
                {cartItems.map((item, i) => (
                  <CartItems
                    key={item._id || i}
                    item={item}
                    navigate={navigate}
                    onIncrementQty={handleIncrementQty}
                    onDecrementQty={handleDecrementQty}
                    onRemoveItem={handleRemoveItem}
                    showToast={showToast}
                  />
                ))}
              </div>

              {/* Summary */}
              <OrderSummary
                count={cartItems.length}
                subtotal={subtotal}
                shipping={0}
                total={totalPrice}
                currency={currency}
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Cart;
