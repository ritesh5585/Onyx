import React from "react";
import { NavLink } from "react-router";

/**
 * EmptyState — Unified empty state component used across Home, Dashboard, Cart.
 * Props:
 *   icon      — emoji or JSX (optional)
 *   eyebrow   — small uppercase label (optional)
 *   title     — main serif headline
 *   body      — supporting text
 *   cta       — { label, to } for NavLink, or { label, onClick } for button (optional)
 */
const EmptyState = ({ icon, eyebrow, title, body, cta }) => (
  <div className="py-24 sm:py-32 flex flex-col items-center justify-center text-center gap-4 px-4">
    {icon && (
      <div className="w-16 h-16 rounded-full border border-[rgba(255,255,255,0.07)] bg-[#0d0d12] flex items-center justify-center text-2xl mb-2">
        {icon}
      </div>
    )}
    {eyebrow && <span className="onyx-eyebrow">{eyebrow}</span>}
    {title && (
      <p
        className="max-w-sm text-xl sm:text-2xl leading-relaxed text-[rgba(238,233,225,0.75)]"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}
      >
        {title}
      </p>
    )}
    {body && (
      <p className="max-w-xs text-[13px] leading-relaxed text-[rgba(238,233,225,0.35)]">
        {body}
      </p>
    )}
    {cta && (
      <div className="mt-4">
        {cta.to ? (
          <NavLink
            to={cta.to}
            className="onyx-btn-primary !w-auto px-8"
          >
            {cta.label}
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={cta.onClick}
            className="onyx-btn-primary !w-auto px-8"
          >
            {cta.label}
          </button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
