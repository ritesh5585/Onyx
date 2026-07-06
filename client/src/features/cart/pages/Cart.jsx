import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useCart } from "../hooks/useCart";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";
import EmptyState from "../../Shared/EmptyState";

// ─────────────────────────────────────────────────────────────────────────────
// CartItem
// ─────────────────────────────────────────────────────────────────────────────
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
    <div className="flex gap-4 sm:gap-5 py-6 sm:py-7 border-b border-[rgba(255,255,255,0.06)] first:border-t">
      {/* ── Image ── */}
      <div
        className="flex-shrink-0 w-[85px] h-[110px] sm:w-[100px] sm:h-[130px] overflow-hidden bg-[#0d0d12] border border-[rgba(255,255,255,0.07)] cursor-pointer group/img rounded-sm"
        onClick={() => product._id && navigate(`/product/${product._id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          product._id &&
          navigate(`/product/${product._id}`)
        }
        aria-label={`View ${product.title}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.15em] text-[rgba(238,233,225,0.2)]">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1.5">
          <span
            className="text-base sm:text-lg font-light text-[#eee9e1] leading-tight truncate cursor-pointer hover:text-[#c49a52] transition-colors duration-300"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            onClick={() => product._id && navigate(`/product/${product._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              product._id &&
              navigate(`/product/${product._id}`)
            }
          >
            {product.title || "Untitled Product"}
          </span>

          {variantLabel && (
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[rgba(238,233,225,0.35)]">
              {variantLabel}
            </span>
          )}

          <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[rgba(238,233,225,0.75)] mt-0.5">
            {itemCurrency} {(unitPrice * qty).toLocaleString()}
          </span>

          <span
            className={`text-[10px] font-semibold tracking-[0.12em] uppercase mt-0.5 flex items-center gap-1.5 ${
              isInStock ? "text-[#81c784]" : "text-[#e57373]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isInStock ? "bg-[#81c784]" : "bg-[#e57373]"}`}
            />
            {isInStock ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
          {/* Quantity stepper */}
          <div className="flex items-center border border-[rgba(255,255,255,0.08)] rounded-md overflow-hidden bg-[#0d0d12]">
            <button
              className="w-8 h-8 flex items-center justify-center text-[rgba(238,233,225,0.5)] hover:text-[#c49a52] hover:bg-[rgba(196,154,82,0.07)] disabled:opacity-25 transition-all border-none bg-transparent cursor-pointer text-lg leading-none"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-9 text-center text-[13px] font-semibold text-[#eee9e1] border-x border-[rgba(255,255,255,0.08)] py-1.5">
              {qty}
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center text-[rgba(238,233,225,0.5)] hover:text-[#c49a52] hover:bg-[rgba(196,154,82,0.07)] disabled:opacity-25 transition-all border-none bg-transparent cursor-pointer text-lg leading-none"
              disabled={qty >= stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button className="flex items-center gap-1.5 bg-transparent border border-[rgba(239,83,80,0.2)] rounded-md px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#e57373] cursor-pointer hover:bg-[rgba(239,83,80,0.07)] hover:border-[rgba(239,83,80,0.45)] transition-all">
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// OrderSummary
// ─────────────────────────────────────────────────────────────────────────────
const OrderSummary = ({ count, subtotal, shipping, total, currency }) => (
  <div className="bg-[#0d0d12] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 sm:p-8 sticky top-20">
    <h2
      className="text-xl font-light text-[#eee9e1] tracking-tight mb-6 pb-5 border-b border-[rgba(255,255,255,0.07)]"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      Order Summary
    </h2>

    <div className="flex flex-col gap-0">
      <div className="flex justify-between items-center py-3 border-b border-[rgba(255,255,255,0.05)]">
        <span className="text-[12px] text-[rgba(238,233,225,0.45)] tracking-wide">
          Subtotal ({count} {count === 1 ? "item" : "items"})
        </span>
        <span className="text-[13px] font-semibold text-[#eee9e1]">
          {currency} {subtotal.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between items-center py-3">
        <span className="text-[12px] text-[rgba(238,233,225,0.45)] tracking-wide">
          Shipping
        </span>
        <span
          className={`text-[13px] font-semibold ${shipping === 0 ? "text-[#81c784]" : "text-[#eee9e1]"}`}
        >
          {shipping === 0 ? "Free" : `${currency} ${shipping}`}
        </span>
      </div>
    </div>

    <div className="h-px bg-[rgba(255,255,255,0.07)] my-1" />

    <div className="flex justify-between items-center pt-4 pb-6">
      <span
        className="text-base font-light text-[#eee9e1]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Total
      </span>
      <span
        className="text-2xl font-semibold text-[#c49a52] tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {currency} {total.toLocaleString()}
      </span>
    </div>

    <button className="onyx-btn-primary w-full flex items-center justify-between px-6">
      <span>Proceed to Checkout</span>
      <span className="text-lg leading-none">→</span>
    </button>

    <NavLink
      to="/"
      className="onyx-btn-secondary block text-center mt-3 !text-[11px] !tracking-[0.1em] uppercase"
    >
      Continue Shopping
    </NavLink>

    {/* Trust badge */}
    <div className="flex items-center gap-2.5 mt-4 px-4 py-3 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.06)] rounded-xl">
      <span className="text-[#c49a52] text-sm flex-shrink-0">🔒</span>
      <span className="text-[11px] text-[rgba(238,233,225,0.35)] tracking-wide leading-relaxed">
        Secure checkout · 256-bit SSL encryption
      </span>
    </div>
  </div>
);

const EMPTY_CART = [];

// ─────────────────────────────────────────────────────────────────────────────
// Main Cart Page
// ─────────────────────────────────────────────────────────────────────────────
const Cart = () => {
  const navigate = useNavigate();
  const rawCartItems = useSelector((state) => state.cart.items);
  const cartItems = rawCartItems || EMPTY_CART;
  const { handleGetCart } = useCart();
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  useEffect(() => {
    handleGetCart();
  }, [handleGetCart]);

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
        <div className="pt-8 pb-24 min-h-[60vh]">
          {/* ── Header ── */}
          <div className="mb-10 pb-8 border-b border-[rgba(255,255,255,0.06)]">
            <p className="onyx-eyebrow mb-3">Shopping Bag</p>
            <h1 className="onyx-page-title">Your Cart</h1>
            <div className="onyx-divider" />
            {!isEmpty && (
              <span className="mt-4 block text-[11px] uppercase tracking-[0.18em] font-semibold text-[rgba(238,233,225,0.4)]">
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
              {/* Items list */}
              <div className="flex flex-col">
                {cartItems.map((item, i) => (
                  <CartItem
                    key={item._id || i}
                    item={item}
                    navigate={navigate}
                  />
                ))}
              </div>

              {/* Summary */}
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
