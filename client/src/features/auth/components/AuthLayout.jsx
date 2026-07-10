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
    const panelElements = rootRef.current.querySelectorAll('.auth-panel__eyebrow, .auth-panel__title, .auth-error, .auth-field, .auth-btn, #google-login-btn, .auth-footer');
    
    // Apply the exact same stagger animation used on the Home page
    if (heroElements.length) animateStaggerFadeUp(heroElements, { duration: 0.4, stagger: 0.08, start: "top 90%" });
    if (panelElements.length) animateStaggerFadeUp(panelElements, { duration: 0.4, stagger: 0.08, delay: 0.15, start: "top 90%" });
  }, []);

  return (
    <div ref={rootRef} className="flex min-h-[100dvh] bg-[#06060a] font-sans antialiased max-[960px]:flex max-[960px]:items-center max-[960px]:justify-center max-[960px]:relative">
    {/* ── LEFT: Hero panel (image via CSS, no img tag) ── */}
    <aside className="auth-hero" aria-hidden="true">
      <header className="relative z-10 flex items-center justify-between px-[42px] py-[32px] max-[960px]:px-[28px] max-[960px]:py-[24px] max-[480px]:px-[24px] max-[480px]:py-[20px]">
        <span className="auth-logo">
          <span className="w-[7px] h-[7px] rounded-full bg-[#c49a52] shadow-[0_0_12px_#c49a52] shrink-0" />
          Onyx
        </span>
        <span className="text-[0.58rem] font-semibold tracking-[0.2em] uppercase text-[#eee9e1]/45 border border-white/5 py-[5px] px-[14px] rounded-full transition-colors duration-300 hover:text-[#eee9e1] hover:border-white/15">Premium Store</span>
      </header>

      <div className="relative z-10 mt-auto px-[42px] pb-[52px] pt-0 max-[960px]:hidden">
        <p className="flex items-center gap-3 text-[0.6rem] font-semibold tracking-[0.26em] uppercase text-[#eee9e1]/45 mb-[14px] before:content-[''] before:w-6 before:h-px before:bg-[#c49a52] before:shrink-0">{eyebrow}</p>
        <h1 className="font-serif text-[clamp(2rem,3.2vw,3rem)] font-light leading-[1.15] text-[#eee9e1] tracking-[-0.01em] mb-0">
          {headline}
          {sub && (<><br /><em className="italic text-[#c49a52]">{sub}</em></>)}
        </h1>
      </div>
    </aside>

    {/* ── RIGHT: Form panel ── */}
    <section className="auth-panel">{children}</section>
  </div>
  );
};

export default AuthLayout;
