import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useCart } from "../hooks/useCart";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";
import EmptyState from "../../Shared/EmptyState";
import OrderSummary from "../components/OrderSummary";

const CartItem = ({
  item,
  navigate,
  onIncrementQty,
  onDecrementQty,
  onRemoveItem,
  showToast,
}) => {
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
    <div className="flex gap-4 border-b border-onyx-border/70 py-6 first:border-t sm:gap-5 sm:py-7">
      {/* ── Image ── */}
      <div
        className="group/img h-[110px] w-[85px] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm border border-onyx-border/70 bg-onyx-surface sm:h-[130px] sm:w-[100px]"
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
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.15em] text-onyx-muted/40">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1.5">
          <span
            className="cursor-pointer truncate font-serif text-base leading-tight text-onyx-text transition-colors duration-300 hover:text-onyx-gold sm:text-lg"
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
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-onyx-muted/60">
              {variantLabel}
            </span>
          )}

          <span className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-onyx-muted/80">
            {itemCurrency} {(unitPrice * qty).toLocaleString()}
          </span>

          <span
            className={`mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isInStock ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${isInStock ? "bg-emerald-400" : "bg-red-400"}`}
            />
            {isInStock ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        {/* ── Actions ── */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center overflow-hidden rounded-md border border-onyx-border/70 bg-onyx-surface">
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent text-lg leading-none text-onyx-muted/70 transition-all hover:bg-onyx-gold/10 hover:text-onyx-gold disabled:opacity-25"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              onClick={async () => {
                if (!item._id || qty <= 1) return;
                try {
                  await onDecrementQty(item._id, qty);
                  showToast("Quantity updated", "success");
                } catch {
                  showToast("Failed to update quantity", "error");
                }
              }}
            >
              −
            </button>
            <span className="w-9 border-x border-onyx-border/70 py-1.5 text-center text-[13px] font-semibold text-onyx-text">
              {qty}
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center text-[rgba(238,233,225,0.5)] hover:text-[#c49a52] hover:bg-[rgba(196,154,82,0.07)] disabled:opacity-25 transition-all border-none bg-transparent cursor-pointer text-lg leading-none"
              disabled={qty >= stock}
              aria-label="Increase quantity"
              onClick={async () => {
                if (!item._id || qty >= stock) return;
                try {
                  await onIncrementQty(item._id, qty);
                  showToast("Quantity updated", "success");
                } catch {
                  showToast("Failed to update quantity", "error");
                }
              }}
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-red-400/20 bg-transparent px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400 transition-all hover:border-red-400/45 hover:bg-red-400/10"
            onClick={async () => {
              if (!item._id) return;
              try {
                await onRemoveItem(item._id);
                showToast("Item removed from cart", "success");
              } catch {
                showToast("Failed to remove item", "error");
              }
            }}
          >
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
};
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
                  <CartItem
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
