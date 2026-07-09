import React, { useRef, useEffect } from "react";
import { animateStaggerFadeUp } from "../../Shared/animations";

/**
 * AuthLayout — shared split-panel wrapper for Login & Register.
 * Left: dark hero image with Onyx branding.
 * Right: form panel (children).
 */
const AuthLayout = ({ children, headline, sub, eyebrow = "Collections" }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    
    // Select elements to stagger
    const heroElements = rootRef.current.querySelectorAll('.auth-logo, .auth-badge, .auth-hero__eyebrow, .auth-hero__headline');
    const panelElements = rootRef.current.querySelectorAll('.auth-panel__eyebrow, .auth-panel__title, .auth-error, .auth-field, .auth-btn, .auth-google-btn, .auth-divider, .auth-footer');
    
    // Apply the exact same stagger animation used on the Home page
    if (heroElements.length) animateStaggerFadeUp(heroElements, { duration: 0.4, stagger: 0.08, start: "top 90%" });
    if (panelElements.length) animateStaggerFadeUp(panelElements, { duration: 0.4, stagger: 0.08, delay: 0.15, start: "top 90%" });
  }, []);

  return (
    <div ref={rootRef} className="auth-root">
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
};

export default AuthLayout;
