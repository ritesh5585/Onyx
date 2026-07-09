import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateFadeUp = (element, options = {}) => {
  if (!element) return;
  return gsap.fromTo(
    element,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      ...options,
    }
  );
};

export const animateStaggerFadeUp = (elements, options = {}) => {
  if (!elements || elements.length === 0) return;
  return gsap.fromTo(
    elements,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elements[0].parentElement,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      ...options,
    }
  );
};

export const animateHeroContent = (element) => {
  if (!element) return;
  return gsap.fromTo(
    element.children,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    }
  );
};

export const animateCardHover = (element, isHovering) => {
  if (!element) return;
  const img = element.querySelector("img");
  if (img) {
    gsap.to(img, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.4,
      ease: "power2.out",
    });
  }
  const overlay = element.querySelector(".card-overlay");
  if (overlay) {
    gsap.to(overlay, {
      opacity: isHovering ? 0.1 : 0,
      duration: 0.3,
    });
  }
  const title = element.querySelector("h3");
  if (title) {
    gsap.to(title, {
      color: isHovering ? "#c49a52" : "#eee9e1",
      duration: 0.2,
    });
  }
};
