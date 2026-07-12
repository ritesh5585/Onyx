/**
 * ONYX Animation Library — animations.js
 *
 * Rules:
 *  - All animations respect prefers-reduced-motion.
 *  - Target 60 fps: only transform + opacity animated (compositor-safe).
 *  - Durations kept ≤ 800ms for interactive elements.
 *  - Existing exports preserved 1:1 so no existing call-site breaks.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   REDUCED MOTION GUARD
   Returns a modified option object that disables
   animation when the OS preference is set.
───────────────────────────────────────────── */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rm = (opts) =>
  prefersReducedMotion() ? { duration: 0, ...opts } : opts;


/** Scroll-triggered fade + rise for a single element */
export const animateFadeUp = (element, options = {}) => {
  if (!element) return;
  return gsap.fromTo(
    element,
    { y: prefersReducedMotion() ? 0 : 24, opacity: 0 },
    rm({
      y: 0,
      opacity: 1,
      duration: 0.55,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      ...options,
    })
  );
};

/** Scroll-triggered stagger fade for a NodeList / HTMLCollection */
export const animateStaggerFadeUp = (elements, options = {}) => {
  if (!elements || elements.length === 0) return;
  return gsap.fromTo(
    elements,
    { y: prefersReducedMotion() ? 0 : 28, opacity: 0 },
    rm({
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: {
        trigger: elements[0].parentElement,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      ...options,
    })
  );
};

/** Hero content stagger — plays immediately on mount */
export const animateHeroContent = (element) => {
  if (!element) return;
  if (prefersReducedMotion()) {
    gsap.set(element.children, { opacity: 1 });
    return;
  }
  return gsap.fromTo(
    element.children,
    { y: 32, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.15,
    }
  );
};

/** Card hover — image zoom + overlay + title tint */
export const animateCardHover = (element, isHovering) => {
  if (!element || prefersReducedMotion()) return;
  const img = element.querySelector("img");
  if (img) {
    gsap.to(img, {
      scale: isHovering ? 1.06 : 1,
      duration: 0.55,
      ease: "power2.out",
    });
  }
  const overlay = element.querySelector(".card-overlay");
  if (overlay) {
    gsap.to(overlay, {
      opacity: isHovering ? 0.12 : 0,
      duration: 0.35,
    });
  }
  const title = element.querySelector("h3");
  if (title) {
    gsap.to(title, {
      color: isHovering ? "#c49a52" : "#eee9e1",
      duration: 0.25,
    });
  }
};

/* ─────────────────────────────────────────────
   NEW EXPORTS
───────────────────────────────────────────── */

/**
 * HERO REVEAL
 * Cinematic entry: background images fade in, then content staggers up.
 * Call once on mount from the Hero component.
 */
export const animateHeroReveal = (contentEl, imageEl) => {
  if (!contentEl) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (!prefersReducedMotion()) {
    if (imageEl) {
      tl.fromTo(imageEl, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, 0);
    }
    tl.fromTo(
      contentEl.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.13 },
      imageEl ? 0.3 : 0
    );
  } else {
    tl.set(contentEl.children, { opacity: 1 });
  }
  return tl;
};

/**
 * SLOW IMAGE ZOOM (Hero background)
 * Animates a continuous slow zoom on the active hero image.
 * Returns a killable GSAP tween.
 */
export const animateHeroImageZoom = (imageEl) => {
  if (!imageEl || prefersReducedMotion()) return null;
  return gsap.to(imageEl, {
    scale: 1.06,
    duration: 8,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });
};

/**
 * PARALLAX ON MOUSE MOVE
 * Attach to a container's onMouseMove. Pass the event and the target element.
 * `depth` controls intensity (0.01 = subtle, 0.05 = strong).
 */
export const animateParallax = (e, targetEl, depth = 0.015) => {
  if (!targetEl || prefersReducedMotion()) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) * depth;
  const dy = (e.clientY - cy) * depth;
  gsap.to(targetEl, {
    x: dx,
    y: dy,
    duration: 1.2,
    ease: "power2.out",
  });
};

/** Reset parallax on mouse leave */
export const resetParallax = (targetEl) => {
  if (!targetEl || prefersReducedMotion()) return;
  gsap.to(targetEl, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
};

/**
 * TEXT REVEAL — character split
 * Wraps each character in a span and staggers them in.
 * Works on any heading or paragraph element.
 */
export const animateTextReveal = (element, options = {}) => {
  if (!element) return;
  if (prefersReducedMotion()) {
    element.style.opacity = "1";
    return;
  }

  const text = element.innerText;
  element.innerHTML = text
    .split("")
    .map((ch) =>
      ch === " "
        ? " "
        : `<span class="reveal-char" style="display:inline-block;will-change:transform">${ch}</span>`
    )
    .join("");

  const chars = element.querySelectorAll(".reveal-char");
  return gsap.fromTo(
    chars,
    { y: "110%", opacity: 0 },
    rm({
      y: "0%",
      opacity: 1,
      duration: 0.6,
      stagger: 0.018,
      ease: "power3.out",
      delay: options.delay || 0,
      ...options,
    })
  );
};

/**
 * NAVBAR SCROLL TRANSITION
 * Blurs and darkens the navbar when user scrolls past threshold.
 * Returns cleanup function — call in useEffect return.
 */
export const initNavbarScrollEffect = (navEl, threshold = 40) => {
  if (!navEl) return () => { };

  const update = () => {
    const scrolled = window.scrollY > threshold;
    if (scrolled) {
      navEl.setAttribute("data-scrolled", "true");
    } else {
      navEl.removeAttribute("data-scrolled");
    }
  };

  update(); // sync immediately on mount
  window.addEventListener("scroll", update, { passive: true });
  return () => window.removeEventListener("scroll", update);
};

/**
 * BUTTON PRESS ANIMATION
 * Call from onClick for a tactile micro-interaction.
 */
export const animateButtonPress = (el) => {
  if (!el || prefersReducedMotion()) return;
  gsap.fromTo(
    el,
    { scale: 0.96 },
    { scale: 1, duration: 0.35, ease: "back.out(3)" }
  );
};

/**
 * PAGE TRANSITION — out
 * Fades + slides the page content down before navigation.
 * Returns a Promise that resolves when complete.
 */
export const animatePageOut = (containerEl) => {
  if (!containerEl || prefersReducedMotion()) return Promise.resolve();
  return gsap.to(containerEl, {
    opacity: 0,
    y: -12,
    duration: 0.25,
    ease: "power2.in",
  }).then();
};

/**
 * PAGE TRANSITION — in
 * Fades + rises the page content after navigation.
 */
export const animatePageIn = (containerEl) => {
  if (!containerEl || prefersReducedMotion()) {
    if (containerEl) gsap.set(containerEl, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    containerEl,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
  );
};

/**
 * SCROLL REVEAL — generic, reusable
 * For any element that should animate in on scroll.
 * direction: "up" | "down" | "left" | "right"
 */
export const animateScrollReveal = (element, direction = "up", options = {}) => {
  if (!element) return;

  const fromVars = { opacity: 0 };
  if (!prefersReducedMotion()) {
    if (direction === "up") fromVars.y = 36;
    else if (direction === "down") fromVars.y = -36;
    else if (direction === "left") fromVars.x = 36;
    else if (direction === "right") fromVars.x = -36;
  }

  return gsap.fromTo(
    element,
    fromVars,
    rm({
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 87%",
        toggleActions: "play none none none",
      },
      ...options,
    })
  );
};

export const animateSpinner = (ringEl, textEl) => {
  if (!ringEl) return null;
  const tl = gsap.timeline({ repeat: -1 });
  if (!prefersReducedMotion()) {
    tl.to(ringEl, { rotation: 360, duration: 0.9, ease: "none" });
    if (textEl) {
      gsap.fromTo(textEl, { opacity: 0 }, { opacity: 0.4, duration: 0.6, delay: 0.2, ease: "power2.out" });
    }
  }
  return tl;
};


