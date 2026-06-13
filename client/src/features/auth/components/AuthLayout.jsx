import React from "react";
import "../auth.css";

/**
 * AuthLayout — shared split-panel wrapper for Login & Register.
 * Left: dark hero image with Onyx branding.
 * Right: form panel (children).
 */
const AuthLayout = ({ children, headline, sub, eyebrow = "Collections" }) => (
  <div className="auth-root">
    {/* ── LEFT: Hero panel (image via CSS, no img tag) ── */}
    <aside className="auth-hero" aria-hidden="true">
      <header className="auth-hero__header">
        <span className="auth-logo">
          <span className="auth-logo__dot" />
          Onyx
        </span>
        <span className="auth-badge">Premium Store</span>
      </header>

        <div className="auth-hero__body">
          <p className="auth-hero__eyebrow">{eyebrow}</p>
          <h1 className="auth-hero__headline">
            {headline}
            {sub && (<><br /><em>{sub}</em></>)}
          </h1>
        </div>
    </aside>

    {/* ── RIGHT: Form panel ── */}
    <section className="auth-panel">{children}</section>
  </div>
);

export default AuthLayout;
