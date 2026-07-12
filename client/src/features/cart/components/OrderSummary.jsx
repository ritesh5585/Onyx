import React from "react";
import { NavLink } from "react-router";

const OrderSummary = ({ count, subtotal, shipping, total, currency }) => {

  return (
    <div className="sticky top-20 rounded-2xl border border-onyx-border/70 bg-onyx-surface p-6 sm:p-8">
      <h2 className="mb-6 border-b border-onyx-border/70 pb-5 font-serif text-xl font-light tracking-tight text-onyx-text">
        Order Summary
      </h2>

      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between border-b border-onyx-border/60 py-3">
          <span className="text-[12px] tracking-wide text-onyx-muted/70">
            Subtotal ({count} {count === 1 ? "item" : "items"})
          </span>
          <span className="text-[13px] font-semibold text-onyx-text">
            {currency} {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-[12px] tracking-wide text-onyx-muted/70">
            Shipping
          </span>
          <span
            className={`text-[13px] font-semibold ${shipping === 0 ? "text-emerald-400" : "text-onyx-text"}`}
          >
            {shipping === 0 ? "Free" : `${currency} ${shipping}`}
          </span>
        </div>
      </div>

      <div className="my-1 h-px bg-onyx-border/70" />

      <div className="flex items-center justify-between pb-6 pt-4">
        <span className="font-serif text-base font-light text-onyx-text">
          Total
        </span>
        <span className="font-serif text-2xl font-semibold tracking-tight text-onyx-gold">
          {currency} {total.toLocaleString()}
        </span>
      </div>

      <button className="onyx-btn-primary flex w-full items-center justify-between px-6">
        <span>Proceed to Checkout</span>
        <span className="text-lg leading-none">→</span>
      </button>

      <NavLink
        to="/"
        className="onyx-btn-secondary mt-3 block text-center text-[11px] uppercase tracking-[0.1em]"
      >
        Continue Shopping
      </NavLink>

      {/* Trust badge */}
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-onyx-border/60 bg-white/5 px-4 py-3">
        <span className="flex-shrink-0 text-sm text-onyx-gold">🔒</span>
        <span className="text-[11px] leading-relaxed tracking-wide text-onyx-muted/60">
          Secure checkout · 256-bit SSL encryption
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
