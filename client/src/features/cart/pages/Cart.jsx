import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useCart } from "../hooks/useCart";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

const EmptyCart = () => (
  <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
    <div className="w-20 h-20 rounded-full bg-[#0f0f13] border border-white/[0.08] flex items-center justify-center text-3xl text-white/25 mb-2">
      🛒
    </div>
    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a09d98]">
      Empty Cart
    </span>
    <p className="max-w-xs text-base md:text-lg leading-relaxed font-['Cormorant_Garamond',serif]">
      Your cart is waiting to be filled with curated pieces from our collection.
    </p>
    <NavLink
      to="/"
      className="onyx-btn-primary inline-flex items-center justify-center gap-2 !w-auto mt-2 px-8"
    >
      Explore Collection <span>→</span>
    </NavLink>
  </div>
);

const CartItem = ({ item, navigate }) => {
  const product = item.product || {};
  const variant = item.variant || null;
  const qty = item.quantity || 1;
  const imageUrl =
    variant?.images?.[0]?.url || product?.images?.[0]?.url || null;
  const unitPrice = variant?.price?.amount || product?.price?.amount || 0;
  const itemCurrency =
    variant?.price?.currency || product?.price?.currency || "INR";
  const stock = variant?.stock ?? product?.stock ?? 0;
  const isInStock = stock > 0;

  // Build variant label (e.g. "Size: M · Color: Black")
  const variantLabel = useMemo(() => {
    if (!variant?.attributes) return "";
    try {
      const attrs = variant.attributes;
      const entries =
        attrs instanceof Map
          ? Array.from(attrs.entries())
          : Object.entries(attrs);
      return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
    } catch {
      return "";
    }
  }, [variant]);

  return (
    <div className="flex gap-4 sm:gap-5 py-5 sm:py-6 border-b border-white/[0.08] first:border-t">
      {/* ── Image ── */}
      <div
        className="group/img flex-shrink-0 w-[90px] h-[115px] sm:w-[110px] sm:h-[140px] rounded-md overflow-hidden bg-[#0f0f13] border border-white/[0.08] cursor-pointer hover:border-white/[0.15]"
        onClick={() => product._id && navigate(`/product/${product._id}`)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-white/25 tracking-[0.1em] uppercase">
            No Image
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1">
          <span
            className="font-['Cormorant_Garamond',serif] text-base sm:text-lg font-medium text-[#eee9e1] leading-tight truncate cursor-pointer hover:text-[#c49a52]"
            onClick={() => product._id && navigate(`/product/${product._id}`)}
          >
            {product.title || "Untitled Product"}
          </span>
          {variantLabel && (
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#a09d98]">
              {variantLabel}
            </span>
          )}
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#eee9e1] mt-0.5">
            {itemCurrency} {(unitPrice * qty).toLocaleString()}
          </span>
          <span
            className={`text-[10px] font-semibold tracking-[0.14em] uppercase mt-0.5 ${
              isInStock ? "text-[#6fcf6f]" : "text-[#cf6f6f]"
            }`}
          >
            {isInStock ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
          <div className="flex items-center border border-white/[0.08] rounded-md overflow-hidden bg-[#15151c]">
            <button
              className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-[#a09d98] cursor-pointer hover:text-[#c49a52] hover:bg-[#c49a52]/[0.08] disabled:opacity-30"
              disabled={qty <= 1}
            >
              −
            </button>
            <span className="w-9 text-center text-sm font-semibold text-[#eee9e1] border-x border-white/[0.08] py-1.5">
              {qty}
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-[#a09d98] cursor-pointer hover:text-[#c49a52] hover:bg-[#c49a52]/[0.08] disabled:opacity-30"
              disabled={qty >= stock}
            >
              +
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-transparent border border-[#cf6f6f]/20 rounded-md px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#cf6f6f] cursor-pointer hover:bg-[#cf6f6f]/[0.08] hover:border-[#cf6f6f] transition-all">
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({ count, subtotal, shipping, total, currency }) => (
  <div className="bg-[#0f0f13] border border-white/[0.08] rounded-xl p-6 sm:p-8 sticky top-20">
    <h2 className="font-['Playfair_Display',Georgia,serif] text-lg font-semibold text-[#eee9e1] tracking-tight mb-6 pb-4 border-b border-white/[0.08]">
      Order Summary
    </h2>
    <div className="flex justify-between items-center py-2.5">
      <span className="text-xs text-[#a09d98] tracking-wide">
        Subtotal ({count} {count === 1 ? "item" : "items"})
      </span>
      <span className="text-sm font-semibold text-[#eee9e1] tracking-wide">
        {currency} {subtotal.toLocaleString()}
      </span>
    </div>
    <div className="flex justify-between items-center py-2.5">
      <span className="text-xs text-[#a09d98] tracking-wide">Shipping</span>
      <span className="text-sm font-semibold text-[#eee9e1] tracking-wide">
        {shipping === 0 ? "Free" : `${currency} ${shipping}`}
      </span>
    </div>
    <div className="h-px bg-white/[0.08] my-3" />
    <div className="flex justify-between items-center pt-4">
      <span className="font-['Playfair_Display',Georgia,serif] text-base font-semibold text-[#eee9e1]">
        Total
      </span>
      <span className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#c49a52] tracking-tight">
        {currency} {total.toLocaleString()}
      </span>
    </div>
    <button className="onyx-btn-primary flex items-center justify-between mt-6 w-full">
      Proceed to Checkout <span className="text-lg">→</span>
    </button>
    <NavLink
      to="/"
      className="onyx-btn-secondary block text-center mt-3 !text-xs !tracking-[0.08em] uppercase"
    >
      Continue Shopping
    </NavLink>
    <div className="flex items-center gap-2 mt-4 px-3.5 py-2.5 bg-[#15151c] border border-white/[0.08] rounded-lg text-[11px] text-[#a09d98]">
      <span className="text-[#c49a52] text-sm">🔒</span> Secure checkout ·
      256-bit SSL encryption
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const { handleGetCart } = useCart();
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  useEffect(() => {
    handleGetCart();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  };

  // Performance Optimization: Cache totals calculation
  const { subtotal, currency } = useMemo(
    () => ({
      subtotal: cartItems.reduce(
        (sum, item) =>
          sum +
          (item.variant?.price?.amount || item.product?.price?.amount || 0) *
            (item.quantity || 1),
        0,
      ),
      currency:
        cartItems[0]?.variant?.price?.currency ||
        cartItems[0]?.product?.price?.currency ||
        "INR",
    }),
    [cartItems],
  );

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
        <div className="pt-8 pb-32 min-h-[60vh]">
          {/* Header */}
          <div className="mb-10">
            <h1 className="onyx-page-title">Your Cart</h1>
            <div className="onyx-divider" />
            {!isEmpty && (
              <span className="mt-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c49a52] block">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {/* Content */}
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
              <div className="flex flex-col">
                {cartItems.map((item, i) => (
                  <CartItem
                    key={item._id || i}
                    item={item}
                    navigate={navigate}
                  />
                ))}
              </div>
              <OrderSummary
                count={cartItems.length}
                subtotal={subtotal}
                shipping={0}
                total={subtotal}
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
