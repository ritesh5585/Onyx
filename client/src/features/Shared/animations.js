/**
 * ONYX Animation Library — animations.js
 *
 * Rules:
 *  - All animations respect prefers-reduced-motion.
 *  - Prefer transform + opacity; keep filter motion short and restrained.
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
export const prefersReducedMotion = () =>
  typeof window === "undefined" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rm = (opts) =>
  prefersReducedMotion() ? { duration: 0, ...opts } : opts;


/** Scroll-triggered fade + rise for a single element */
export const animateFadeUp = (element, options = {}) => {
  if (!element) return;
  if (prefersReducedMotion()) {
    gsap.set(element, { y: 0, opacity: 1 });
    return;
  }
  return gsap.fromTo(
    element,
    { y: 24, opacity: 0 },
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
  if (prefersReducedMotion()) {
    gsap.set(elements, { y: 0, opacity: 1 });
    return;
  }
  return gsap.fromTo(
    elements,
    { y: 28, opacity: 0 },
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
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: isHovering ? 1.035 : 1,
      duration: 0.42,
      ease: "power2.out",
    });
  }
  const overlay = element.querySelector(".card-overlay");
  if (overlay) {
    gsap.to(overlay, {
      opacity: isHovering ? 0.12 : 0,
      duration: 0.3,
    });
  }
  const title = element.querySelector("h3");
  if (title) {
    gsap.to(title, {
      color: isHovering ? "#c49a52" : "#eee9e1",
      duration: 0.22,
    });
  }
};

/* ─────────────────────────────────────────────
   NEW EXPORTS
───────────────────────────────────────────── */

/**
 * HERO REVEAL
 * Cinematic entry: the active image scales in, then content staggers up.
 * Call once on mount from the Hero component.
 */
export const animateHeroReveal = (contentEl, imageEl) => {
  if (!contentEl) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (!prefersReducedMotion()) {
    if (imageEl) {
      tl.fromTo(imageEl, { scale: 1.08 }, { scale: 1, duration: 1.2 }, 0);
    }
    tl.fromTo(
      contentEl.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.13 },
      imageEl ? 0.3 : 0
    );
  } else {
    tl.set(contentEl.children, { opacity: 1, y: 0 });
    if (imageEl) tl.set(imageEl, { scale: 1 });
  }
  return tl;
};

/**
 * SLOW IMAGE ZOOM (Hero background)
 * Adds a restrained one-time zoom to the active hero image.
 * Returns a killable GSAP tween.
 */
export const animateHeroImageZoom = (imageEl, delay = 0) => {
  if (!imageEl || prefersReducedMotion()) return null;
  return gsap.to(imageEl, {
    scale: 1.025,
    duration: 8,
    ease: "power2.out",
    delay,
  });
};

/** Scrubs the hero back as the next section naturally overlaps it. */
export const animateHeroScroll = (
  heroEl,
  imageLayerEl,
  imageEl,
  contentEl,
  overlayEl,
) => {
  if (!heroEl || !imageLayerEl || !imageEl || !contentEl || !overlayEl) return;

  const media = gsap.matchMedia();
  const createTransition = (pin) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroEl,
        start: "top top",
        end: pin ? "+=55%" : "bottom top",
        pin: pin ? heroEl : false,
        pinSpacing: false,
        scrub: 0.65,
        anticipatePin: pin ? 1 : 0,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(imageLayerEl, { scale: 0.94 }, 0)
      .to(imageEl, { filter: "blur(3px)", opacity: 0.68 }, 0)
      .to(overlayEl, { opacity: 1 }, 0)
      .to(contentEl, { y: -20, opacity: 0 }, 0);

    return () => timeline.scrollTrigger?.kill();
  };

  media.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => createTransition(true),
  );
  media.add(
    "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
    () => createTransition(false),
  );
  return media;
};

/** Reveals cards in small batches as they approach the viewport. */
export const animateScrollRevealBatch = (elements) => {
  const targets = Array.from(elements || []).filter(Boolean);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  const images = targets
    .map((element) => element.querySelector("img"))
    .filter(Boolean);
  const activeTweens = new Set();
  const triggers = ScrollTrigger.batch(targets, {
    start: "top 92%",
    once: true,
    batchMax: 4,
    interval: 0.12,
    onEnter: (batch) => {
      const tween = gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.07,
        ease: "back.out(1.35)",
        onComplete: () => activeTweens.delete(tween),
      });
      activeTweens.add(tween);

      const batchImages = batch
        .map((element) => element.querySelector("img"))
        .filter(Boolean);
      if (batchImages.length) {
        const imageTween = gsap.to(batchImages, {
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
        });
        activeTweens.add(imageTween);
        imageTween.eventCallback("onComplete", () =>
          activeTweens.delete(imageTween),
        );
      }
    },
  });
  gsap.set(targets, { autoAlpha: 0, y: 24, scale: 0.96 });
  gsap.set(images, { scale: 1.035 });

  return () => {
    triggers.forEach((trigger) => trigger.kill());
    activeTweens.forEach((tween) => tween.kill());
    gsap.set(targets, { clearProps: "opacity,visibility,transform" });
    gsap.set(images, { clearProps: "transform" });
  };
};

/** Subtle desktop-only background movement for editorial banners. */
export const animateScrollParallax = (backgroundEl, triggerEl) => {
  if (!backgroundEl || !triggerEl) return;

  const media = gsap.matchMedia();
  media.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () =>
      gsap.to(backgroundEl, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }),
  );
  return media;
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
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, x: 0, y: 0 });
    return;
  }

  const fromVars = { opacity: 0 };
  if (direction === "up") fromVars.y = 36;
  else if (direction === "down") fromVars.y = -36;
  else if (direction === "left") fromVars.x = 36;
  else if (direction === "right") fromVars.x = -36;

  return gsap.fromTo(
    element,
    fromVars,
    rm({
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
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
