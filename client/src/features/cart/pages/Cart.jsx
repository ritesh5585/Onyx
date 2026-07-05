import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useCart } from "../hooks/useCart";
import Layout from "../../Shared/Layout";
import Toast from "../../Shared/Toast";

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCart } = useCart();

  /* ── Toast State ── */
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });
  const showToast = (msg, type = "success") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    handleGetCart();
  }, []);

  /* ── Price Calculations (UI-only, no API needed) ── */
  const subtotal =
    cartItems?.reduce((sum, item) => {
      const price =
        item.variant?.price?.amount || item.product?.price?.amount || 0;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0) || 0;

  const shipping = 0;
  const total = subtotal + shipping;
  const currency =
    cartItems?.[0]?.variant?.price?.currency ||
    cartItems?.[0]?.product?.price?.currency ||
    "INR";

  /* ════════════════════════════════════════════
     EMPTY CART — when no items in cart
     ════════════════════════════════════════════ */
  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout showBackButton={true}>
        {/* Toast */}
        {toast.visible && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
          />
        )}

        <div className="pt-8 pb-32 min-h-[60vh]">
          <div className="mb-10">
            <h1 className="onyx-page-title">Your Cart</h1>
            <div className="onyx-divider" />
          </div>

          {/* Empty State */}
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#0f0f13] border border-white/[0.08] flex items-center justify-center text-3xl text-white/25 mb-2">
              🛒
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a09d98]">
              Empty Cart
            </span>
            <p className="max-w-xs text-base md:text-lg leading-relaxed font-['Cormorant_Garamond',serif]">
              Your cart is waiting to be filled with curated pieces from our
              collection.
            </p>
            <NavLink
              to="/"
              className="onyx-btn-primary inline-flex items-center justify-center gap-2 !w-auto mt-2 px-8"
            >
              Explore Collection <span>→</span>
            </NavLink>
          </div>
        </div>
      </Layout>
    );
  }

  /* ════════════════════════════════════════════
     CART WITH ITEMS
     ════════════════════════════════════════════ */
  return (
    <>
      {/* Toast */}
      {toast.visible && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}

      <Layout showBackButton={true}>
        <div className="pt-8 pb-32 min-h-[60vh]">
          {/* ── Header ── */}
          <div className="flex flex-col gap-1 mb-10">
            <h1 className="onyx-page-title">Your Cart</h1>
            <div className="onyx-divider" />
            <span className="mt-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c49a52]">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* ── Grid: Items + Summary ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
            {/* ─────── Items Column ─────── */}
            <div className="flex flex-col">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const variant = item.variant || null;
                const qty = item.quantity || 1;

                /* Resolve image */
                const imageUrl =
                  variant?.images?.[0]?.url ||
                  product?.images?.[0]?.url ||
                  null;

                /* Resolve price */
                const unitPrice =
                  variant?.price?.amount || product?.price?.amount || 0;
                const itemCurrency =
                  variant?.price?.currency || product?.price?.currency || "INR";

                /* Resolve stock */
                const stock = variant?.stock ?? product?.stock ?? 0;
                const isInStock = stock > 0;

                /* Build variant label (e.g. "Size: M · Color: Black") */
                const variantLabel = variant?.attributes
                  ? (() => {
                      try {
                        const entries =
                          variant.attributes instanceof Map
                            ? Array.from(variant.attributes.entries())
                            : typeof variant.attributes === "object" &&
                                !Array.isArray(variant.attributes)
                              ? Object.entries(variant.attributes)
                              : [];
                        return entries
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" · ");
                      } catch {
                        return "";
                      }
                    })()
                  : "";

                return (
                  <div
                    key={item._id || index}
                    className={`flex gap-4 sm:gap-5 py-5 sm:py-6 border-b border-white/[0.08] ${
                      index === 0 ? "border-t" : ""
                    }`}
                  >
                    {/* ── Image ── */}
                    <div
                      className="group/img flex-shrink-0 w-[90px] h-[115px] sm:w-[110px] sm:h-[140px] rounded-md overflow-hidden bg-[#0f0f13] border border-white/[0.08] cursor-pointer transition-[border-color] duration-200 hover:border-white/[0.15]"
                      onClick={() =>
                        product._id && navigate(`/product/${product._id}`)
                      }
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title || "Product"}
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
                        {/* Title */}
                        <span
                          className="font-['Cormorant_Garamond',serif] text-base sm:text-lg font-medium text-[#eee9e1] leading-tight truncate cursor-pointer transition-colors duration-200 hover:text-[#c49a52]"
                          onClick={() =>
                            product._id && navigate(`/product/${product._id}`)
                          }
                        >
                          {product.title || "Untitled Product"}
                        </span>

                        {/* Variant info */}
                        {variantLabel && (
                          <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-[#a09d98]">
                            {variantLabel}
                          </span>
                        )}

                        {/* Price */}
                        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#eee9e1] mt-0.5">
                          {itemCurrency} {(unitPrice * qty).toLocaleString()}
                        </span>

                        {/* Stock */}
                        <span
                          className={`text-[10px] font-semibold tracking-[0.14em] uppercase mt-0.5 ${
                            isInStock ? "text-[#6fcf6f]" : "text-[#cf6f6f]"
                          }`}
                        >
                          {isInStock ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      {/* ── Bottom: Qty + Remove ── */}
                      <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-white/[0.08] rounded-md overflow-hidden bg-[#15151c]">
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-[#a09d98] text-base cursor-pointer transition-all duration-200 hover:text-[#c49a52] hover:bg-[#c49a52]/[0.08] disabled:opacity-30 disabled:cursor-not-allowed"
                            type="button"
                            disabled={qty <= 1}
                            /* TODO: onClick={() => handleDecrementQty(item._id)} */
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-semibold text-[#eee9e1] border-x border-white/[0.08] py-1.5 select-none">
                            {qty}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center bg-transparent border-none text-[#a09d98] text-base cursor-pointer transition-all duration-200 hover:text-[#c49a52] hover:bg-[#c49a52]/[0.08] disabled:opacity-30 disabled:cursor-not-allowed"
                            type="button"
                            disabled={qty >= stock}
                            /* TODO: onClick={() => handleIncrementQty(item._id)} */
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          className="flex items-center gap-1.5 bg-transparent border border-[#cf6f6f]/20 rounded-md px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#cf6f6f] cursor-pointer transition-all duration-200 hover:bg-[#cf6f6f]/[0.08] hover:border-[#cf6f6f] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                          type="button"
                          /* TODO: onClick={() => handleRemoveItem(item._id)} */
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ─────── Order Summary ─────── */}
            <div className="bg-[#0f0f13] border border-white/[0.08] rounded-xl p-6 sm:p-8 sticky top-20">
              <h2 className="font-['Playfair_Display',Georgia,serif] text-lg font-semibold text-[#eee9e1] tracking-tight mb-6 pb-4 border-b border-white/[0.08]">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-[#a09d98] tracking-wide">
                  Subtotal ({cartItems.length}{" "}
                  {cartItems.length === 1 ? "item" : "items"})
                </span>
                <span className="text-sm font-semibold text-[#eee9e1] tracking-wide">
                  {currency} {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-[#a09d98] tracking-wide">
                  Shipping
                </span>
                <span className="text-sm font-semibold text-[#eee9e1] tracking-wide">
                  {shipping === 0 ? "Free" : `${currency} ${shipping}`}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.08] my-3" />

              {/* Total */}
              <div className="flex justify-between items-center pt-4">
                <span className="font-['Playfair_Display',Georgia,serif] text-base font-semibold text-[#eee9e1]">
                  Total
                </span>
                <span className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#c49a52] tracking-tight">
                  {currency} {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout */}
              <button
                className="onyx-btn-primary flex items-center justify-between mt-6"
                type="button"
                /* TODO: onClick={() => navigate("/checkout")} */
              >
                Proceed to Checkout
                <span className="text-lg">→</span>
              </button>

              {/* Continue Shopping */}
              <NavLink
                to="/"
                className="onyx-btn-secondary block text-center mt-3 !text-xs !tracking-[0.08em] uppercase"
              >
                Continue Shopping
              </NavLink>

              {/* Info Badge */}
              <div className="flex items-center gap-2 mt-4 px-3.5 py-2.5 bg-[#15151c] border border-white/[0.08] rounded-lg text-[11px] text-[#a09d98]">
                <span className="flex-shrink-0 text-[#c49a52] text-sm">🔒</span>
                Secure checkout · 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;

/*
 ╔══════════════════════════════════════════════════════════════════════════╗
 ║                                                                        ║
 ║   📋  DEVELOPER NOTES — WHAT YOU NEED TO DO (LOGIC SIDE)               ║
 ║                                                                        ║
 ║   The entire UI is done. You only need to wire up 3 handler functions  ║
 ║   and 2 API endpoints. Read each section below carefully.              ║
 ║                                                                        ║
 ╚══════════════════════════════════════════════════════════════════════════╝

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 1 — cart.slice.js (Redux Slice)                                   │
 │  File: features/cart/state/cart.slice.js                                 │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: setItems, addItems                                 │
 │  You need to add 2 more reducers:                                       │
 │                                                                         │
 │  ① removeItem — removes one item from the array by its _id              │
 │     HOW: Filter the items array, keep everything except the one         │
 │          whose _id matches action.payload                               │
 │                                                                         │
 │     removeItem: (state, action) => {                                    │
 │       state.items = state.items.filter(                                 │
 │         item => item._id !== action.payload                             │
 │       );                                                                │
 │     }                                                                   │
 │                                                                         │
 │  ② updateItemQty — updates quantity of a specific item                  │
 │     HOW: Find the item by _id, then update its quantity field           │
 │                                                                         │
 │     updateItemQty: (state, action) => {                                 │
 │       const { cartItemId, quantity } = action.payload;                  │
 │       const item = state.items.find(i => i._id === cartItemId);        │
 │       if (item) item.quantity = quantity;                               │
 │     }                                                                   │
 │                                                                         │
 │  WHY DOES THIS WORK?                                                    │
 │  → Redux Toolkit uses Immer under the hood, so you CAN mutate          │
 │    state directly inside reducers (it handles immutability for you).    │
 │                                                                         │
 │  Don't forget to export:                                                │
 │  export const { setItems, addItems, removeItem, updateItemQty }        │
 │    = cartSlice.actions;                                                 │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 2 — cart.api.js (API Service Layer)                               │
 │  File: features/cart/service/cart.api.js                                 │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: addToCart, getCart                                  │
 │  You need to add 2 more API functions:                                  │
 │                                                                         │
 │  ① removeFromCart — tells the backend to remove an item                 │
 │                                                                         │
 │     export const removeFromCart = async (cartItemId) => {               │
 │       return await api.delete(`/remove/${cartItemId}`)                  │
 │         .then(res => res.data);                                         │
 │     };                                                                  │
 │                                                                         │
 │  ② updateCartQty — tells the backend to change item quantity            │
 │                                                                         │
 │     export const updateCartQty = async (cartItemId, quantity) => {      │
 │       return await api.patch(`/update/${cartItemId}`, { quantity })     │
 │         .then(res => res.data);                                         │
 │     };                                                                  │
 │                                                                         │
 │  WHY .then(res => res.data)?                                            │
 │  → Axios wraps the response in a { data, status, headers } object.     │
 │    By chaining .then(res => res.data), you extract just the server's   │
 │    response body. This is your existing pattern in addToCart/getCart.   │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 3 — useCart.js (Custom Hook)                                      │
 │  File: features/cart/hooks/useCart.js                                    │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Currently you have: handleAddtoCart, handleGetCart                      │
 │  You need to add 3 new handler functions:                               │
 │                                                                         │
 │  ① handleRemoveItem(cartItemId)                                         │
 │     FLOW:                                                               │
 │       1. Call removeFromCart(cartItemId) from cart.api.js                │
 │       2. On success → dispatch(removeItem(cartItemId))                  │
 │       3. On error → console.error + throw error (so Cart.jsx            │
 │          can catch it and show error toast)                              │
 │                                                                         │
 │  ② handleIncrementQty(cartItemId, currentQty)                           │
 │     FLOW:                                                               │
 │       1. const newQty = currentQty + 1                                  │
 │       2. Call updateCartQty(cartItemId, newQty) from cart.api.js         │
 │       3. On success → dispatch(updateItemQty({cartItemId, quantity: newQty}))│
 │       4. On error → console.error + throw                              │
 │                                                                         │
 │  ③ handleDecrementQty(cartItemId, currentQty)                           │
 │     FLOW:                                                               │
 │       1. Guard: if (currentQty <= 1) return; // don't go below 1       │
 │       2. const newQty = currentQty - 1                                  │
 │       3. Call updateCartQty(cartItemId, newQty)                          │
 │       4. On success → dispatch(updateItemQty({cartItemId, quantity: newQty}))│
 │       5. On error → console.error + throw                              │
 │                                                                         │
 │  WHY THROW ERRORS?                                                      │
 │  → When you throw the error, the Cart.jsx component can use             │
 │    try/catch around the handler call to show success or error toasts.   │
 │    This keeps the error handling in the UI where the user can see it.   │
 │                                                                         │
 │  Don't forget to return the new handlers:                               │
 │  return { handleAddtoCart, handleGetCart,                                │
 │           handleRemoveItem, handleIncrementQty, handleDecrementQty };   │
 │                                                                         │
 │  Don't forget to import new functions at the top:                       │
 │  import { addToCart, getCart, removeFromCart, updateCartQty }            │
 │    from "../service/cart.api";                                           │
 │  import { addItems, setItems, removeItem, updateItemQty }              │
 │    from "../state/cart.slice";                                           │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 4 — Wiring in Cart.jsx (THIS FILE)                                │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  Once Steps 1-3 are done, update this file:                             │
 │                                                                         │
 │  ① Destructure new handlers from useCart:                                │
 │     const { handleGetCart, handleRemoveItem,                            │
 │             handleIncrementQty, handleDecrementQty } = useCart();       │
 │                                                                         │
 │  ② Replace the 4 TODO comments with onClick handlers:                   │
 │                                                                         │
 │     Decrement button (−):                                               │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleDecrementQty(item._id, qty);                      │
 │         } catch { showToast("Failed to update quantity", "error"); }    │
 │       }}                                                                │
 │                                                                         │
 │     Increment button (+):                                               │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleIncrementQty(item._id, qty);                      │
 │         } catch { showToast("Failed to update quantity", "error"); }    │
 │       }}                                                                │
 │                                                                         │
 │     Remove button (✕ Remove):                                           │
 │       onClick={async () => {                                            │
 │         try {                                                           │
 │           await handleRemoveItem(item._id);                             │
 │           showToast("Item removed from cart", "success");               │
 │         } catch { showToast("Failed to remove item", "error"); }       │
 │       }}                                                                │
 │                                                                         │
 │     Checkout button:                                                    │
 │       onClick={() => navigate("/checkout")}                             │
 │       (or wherever your checkout route will be)                         │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  STEP 5 — Backend Routes (Express/Node.js)                              │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  You need 2 new routes in your cart router on the backend:              │
 │                                                                         │
 │  ① DELETE  /api/cart/remove/:cartItemId                                 │
 │     → Find the user's cart (via auth middleware)                        │
 │     → Find the item inside cart.items with matching _id                 │
 │     → Remove it using pull or filter                                    │
 │     → Save and return the updated cart                                  │
 │                                                                         │
 │  ② PATCH   /api/cart/update/:cartItemId                                 │
 │     → Body: { quantity: Number }                                        │
 │     → Find the user's cart, find the item by _id                       │
 │     → Validate: quantity >= 1 AND quantity <= product/variant stock     │
 │     → Update item.quantity = quantity                                   │
 │     → Save and return the updated cart                                  │
 │                                                                         │
 │  WHY VALIDATE ON BACKEND?                                               │
 │  → The frontend already disables buttons at boundaries (qty <= 1       │
 │    and qty >= stock), but backend validation is a safety net.           │
 │    Never trust the client — always re-validate on the server.          │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘

 ┌──────────────────────────────────────────────────────────────────────────┐
 │  🔄  COMPLETE DATA FLOW (How it all connects)                           │
 ├──────────────────────────────────────────────────────────────────────────┤
 │                                                                         │
 │  User clicks "+" button on a cart item                                  │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Cart.jsx calls handleIncrementQty(itemId, currentQty)                  │
 │    │                                                                    │
 │    ▼                                                                    │
 │  useCart hook calculates newQty = currentQty + 1                        │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Calls updateCartQty(itemId, newQty) — sends PATCH to backend           │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Backend validates & updates the DB, returns success                    │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Hook dispatches updateItemQty({ cartItemId, quantity: newQty })        │
 │    │                                                                    │
 │    ▼                                                                    │
 │  Redux store updates items array (Immer handles immutability)           │
 │    │                                                                    │
 │    ▼                                                                    │
 │  useSelector in Cart.jsx detects the change → React re-renders          │
 │    │                                                                    │
 │    ▼                                                                    │
 │  UI shows the updated quantity. Done! ✅                                 │
 │                                                                         │
 │  Same flow for "−" (decrement) and "✕ Remove" (remove).                │
 │  The only difference is which API + reducer gets called.               │
 │                                                                         │
 └──────────────────────────────────────────────────────────────────────────┘
*/
