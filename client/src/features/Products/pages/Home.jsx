import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Layout from "../../Shared/Layout";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import ProductCatalogSection from "../components/ProductCatalogSection";
import {
  animateHeroReveal,
  animateHeroImageZoom,
  animateParallax,
  resetParallax,
  animateStaggerFadeUp,
  animateFadeUp,
  animateScrollReveal,
  animateButtonPress,
} from "../../Shared/animations";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORIES = [
  { label: "All", sub: "The full edit", icon: "✦" },
  { label: "Outerwear", sub: "Coats & Jackets", icon: "🧥" },
  { label: "Tailoring", sub: "Suits & Blazers", icon: "👔" },
  { label: "Knitwear", sub: "Sweaters & Cardigans", icon: "🧣" },
  { label: "Denim", sub: "Jeans & Shorts", icon: "👖" },
  { label: "Footwear", sub: "Shoes & Boots", icon: "👞" },
  { label: "Accessories", sub: "Bags & Jewellery", icon: "👜" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
];

const EDITORIAL_IMAGES = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=800&auto=format&fit=crop",
];

const EDITORIALS_DATA = [
  {
    img: EDITORIAL_IMAGES[0],
    label: "The Minimal Edit",
    sub: "Quiet luxury redefined",
  },
  { img: EDITORIAL_IMAGES[1], label: "After Dark", sub: "Evening essentials" },
  {
    img: EDITORIAL_IMAGES[2],
    label: "Street Heritage",
    sub: "Culture meets couture",
  },
  {
    img: EDITORIAL_IMAGES[3],
    label: "The Archive",
    sub: "Timeless silhouettes",
  },
];

const PROMO_PERKS = [
  { icon: "✦", title: "Free Shipping", sub: "On all orders above ₹5,000" },
  { icon: "◈", title: "Easy Returns", sub: "30-day hassle-free returns" },
  {
    icon: "⬡",
    title: "Authenticated",
    sub: "Every piece verified & certified",
  },
];

const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", to: "/" },
      { label: "New Arrivals", to: "/" },
      { label: "Best Sellers", to: "/" },
      { label: "Collections", to: "/" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "Cart", to: "/getyourcart" },
    ],
  },
  {
    heading: "Sellers",
    links: [
      { label: "Become a Seller", to: "/register" },
      { label: "Seller Dashboard", to: "/seller/dashboard" },
      { label: "Upload Product", to: "/seller/create-product" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Onyx", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

/* ─────────────────────────────────────────────
   REUSABLE LAYOUT: Section Header
   (styling only — added optional linkId/linkLabel
   support so every row can carry a "View All")
───────────────────────────────────────────── */
const SectionHeader = ({ eyebrow, title, linkId, linkLabel }) => (
  <div className="mb-8 sm:mb-10 md:mb-14 flex items-end justify-between gap-4">
    <div>
      <p className="onyx-eyebrow mb-2 sm:mb-3">{eyebrow}</p>
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-tight text-onyx-text">
        {title}
      </h2>
      <div className="onyx-divider" />
    </div>
    {linkId && (
      <button
        onClick={() =>
          document
            .getElementById(linkId)
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="group hidden shrink-0 items-center gap-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-onyx-muted transition-colors hover:text-onyx-gold sm:flex"
        aria-label={linkLabel}
      >
        {linkLabel}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   HERO
   (animation calls untouched — only visual polish:
   softer vignette, pill eyebrow, refined CTA spacing)
───────────────────────────────────────────── */
const Hero = ({ onShop, onExplore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const contentRef = useRef(null);
  const activeImgRef = useRef(null);
  const sectionRef = useRef(null);
  const zoomTweenRef = useRef(null);

  useEffect(() => {
    // Cinematic hero reveal
    animateHeroReveal(contentRef.current, activeImgRef.current);
    // Slow zoom loop on the active image
    zoomTweenRef.current = animateHeroImageZoom(activeImgRef.current);
    // Slide show
    const id = setInterval(
      () => setCurrentIndex((p) => (p + 1) % HERO_IMAGES.length),
      4500,
    );
    return () => {
      clearInterval(id);
      zoomTweenRef.current?.kill();
    };
  }, []);

  // Restart zoom on slide change
  useEffect(() => {
    zoomTweenRef.current?.kill();
    if (activeImgRef.current) {
      zoomTweenRef.current = animateHeroImageZoom(activeImgRef.current);
    }
  }, [currentIndex]);

  const handleMouseMove = useCallback(
    (e) => animateParallax(e, contentRef.current, 0.012),
    [],
  );
  const handleMouseLeave = useCallback(
    () => resetParallax(contentRef.current),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] sm:min-h-[92vh] items-end overflow-hidden px-5 pb-14 pt-12 sm:px-8 sm:pb-24 lg:-mx-12 lg:px-12 xl:-mx-20 xl:px-20 bg-onyx-black"
      aria-label="Hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img}
          ref={i === currentIndex ? activeImgRef : null}
          src={img}
          alt={`Hero ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-1200 ease-in-out will-change-[opacity,transform] ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient overlays — slightly deeper vignette for text contrast */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_top,rgba(6,6,10,1)_0%,rgba(6,6,10,0.82)_32%,rgba(6,6,10,0.32)_68%,transparent_100%),linear-gradient(to_right,rgba(6,6,10,0.75)_0%,transparent_62%)]" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-2xl will-change-transform"
      >
        <span className="onyx-eyebrow mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-onyx-gold/25 bg-onyx-gold/5 px-3.5 py-1.5 !mb-5">
          New Season — 2026
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-light leading-[1.1] tracking-tight text-onyx-text mb-5 sm:mb-6">
          Dressed in
          <br />
          <em className="not-italic text-onyx-gold">nothing but</em>
          <br />
          intention.
        </h1>
        <p className="mb-8 sm:mb-10 max-w-md text-sm sm:text-[15px] leading-relaxed text-onyx-muted">
          Curated luxury fashion. Every piece, an expression. Discover the
          archive.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <button
            onClick={(e) => {
              animateButtonPress(e.currentTarget);
              onShop();
            }}
            className="onyx-btn-primary !w-auto px-7 sm:px-10 py-3 sm:py-4 text-[11px] sm:text-[12px]"
          >
            Shop Collection
          </button>
          <button
            onClick={(e) => {
              animateButtonPress(e.currentTarget);
              onExplore();
            }}
            className="onyx-btn-secondary !w-auto px-7 sm:px-10 py-3 sm:py-4 text-[11px] sm:text-[12px]"
          >
            Explore Archive
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-px transition-all duration-500 ${
              i === currentIndex
                ? "w-10 bg-onyx-gold"
                : "w-4 bg-onyx-text/30 hover:bg-onyx-text/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 opacity-30 md:flex">
        <div className="h-12 w-px bg-onyx-text" />
        <span className="origin-bottom rotate-90 text-[9px] uppercase tracking-[0.2em] text-onyx-text">
          Scroll
        </span>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   HORIZONTAL CATEGORY RAIL
───────────────────────────────────────────── */
const CategoryStrip = ({ activeCategory = "All", onSelectCategory }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = animateStaggerFadeUp(containerRef.current?.children);
    return () => {
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, []);

  return (
    <section className="border-y border-onyx-border/70 bg-onyx-black py-6 sm:py-8">
      <div className="mb-4 flex items-end justify-between px-5 sm:px-8 lg:px-12 xl:px-20">
        <div>
          <p className="onyx-eyebrow mb-1">The collection</p>
          <h2 className="font-serif text-xl font-light text-onyx-text sm:text-2xl">
            Shop by category
          </h2>
        </div>
        <span className="pb-1 text-[9px] uppercase tracking-[0.16em] text-onyx-muted sm:text-[10px]">
          Swipe to explore <span className="ml-1 text-onyx-gold" aria-hidden="true">→</span>
        </span>
      </div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 sm:px-8 lg:px-12 xl:px-20"
        aria-label="Shop product categories"
      >
        {CATEGORIES.map((cat, i) => {
          const isSelected = activeCategory?.toLowerCase() === cat.label.toLowerCase();
          return (
            <button
              type="button"
              key={cat.label}
              onClick={() => onSelectCategory?.(cat.label)}
              aria-pressed={isSelected}
              className={`group relative flex h-[112px] w-[132px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-300 sm:h-[132px] sm:w-[168px] sm:p-4 ${
                isSelected
                  ? "border-onyx-gold/70 bg-gradient-to-br from-onyx-gold/20 via-onyx-card to-onyx-surface shadow-[0_8px_24px_rgba(196,154,82,0.12)]"
                  : "border-onyx-border bg-gradient-to-br from-white/[0.06] to-onyx-surface hover:border-onyx-gold/40 hover:from-onyx-gold/10"
              }`}
            >
              <span
                className={`text-xl transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-2xl ${
                  isSelected ? "text-onyx-gold" : "text-onyx-text/80"
                }`}
                aria-hidden="true"
              >
                {cat.icon}
              </span>
              <span>
                <span className={`block font-serif text-base leading-tight sm:text-lg ${isSelected ? "text-onyx-gold" : "text-onyx-text"}`}>
                  {cat.label}
                </span>
                <span className="mt-1 block truncate text-[8px] uppercase tracking-[0.12em] text-onyx-muted sm:text-[9px]">
                  {cat.sub}
                </span>
              </span>
              {i === 0 && (
                <span className="absolute right-3 top-3 text-[9px] uppercase tracking-[0.12em] text-onyx-gold/80">
                  Edit
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

// /* ─────────────────────────────────────────────
//    FEATURED COLLECTION (editorial hero grid)
// ───────────────────────────────────────────── */
const FeaturedCard = ({ product, isHero = false, onNavigate }) => {
  if (!product) return null;
  const imgUrl = product.images?.[0]?.url;

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer bg-onyx-surface ${
        isHero ? "sm:row-span-2 h-[400px] sm:h-full" : "aspect-[3/2]"
      }`}
      onClick={() => onNavigate(product._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNavigate(product._id)}
      aria-label={product.title}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-[10px] uppercase tracking-widest text-onyx-muted/40">
            No Image
          </span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top Right Plus Button */}
      <div className="absolute top-4 right-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-onyx-gold/40 bg-black/30 text-onyx-gold backdrop-blur-sm transition-all duration-300 group-hover:bg-onyx-gold group-hover:text-black">
        <span className="text-lg font-light leading-none mb-[1px]">+</span>
      </div>

      {/* Bottom Text Area */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end">
        <h3
          className={`font-serif text-white mb-1 transition-transform duration-300 group-hover:-translate-y-1 ${
            isHero
              ? "text-2xl sm:text-[28px] leading-tight"
              : "text-lg sm:text-xl"
          }`}
        >
          {product.title}
        </h3>
        <p className="text-[11px] sm:text-xs font-medium tracking-wider text-onyx-gold transition-transform duration-300 group-hover:-translate-y-1">
          {product.price?.currency === "INR"
            ? "₹"
            : product.price?.currency || ""}
          {product.price?.amount?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
  );
};

const FeaturedCollection = ({ products, onNavigate }) => {
  const ref = useRef(null);
  useEffect(() => {
    animateFadeUp(ref.current);
  }, []);

  if (!products || products.length < 2) return null;
  const [hero, ...rest] = products; // Already sliced from parent

  return (
    <section ref={ref} className="onyx-section" id="featured">
      <SectionHeader
        eyebrow="Curated Selection"
        title="Featured Pieces"
        linkId="new-arrivals"
        linkLabel="View All"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <FeaturedCard product={hero} isHero={true} onNavigate={onNavigate} />
        {rest.map((p) => (
          <FeaturedCard
            key={p._id}
            product={p}
            isHero={false}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
};

// /* ─────────────────────────────────────────────
//    EDITORIAL GRID (style inspiration — static)
// ───────────────────────────────────────────── */
const EditorialGrid = () => {
  const ref = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current.forEach((el, i) => {
      animateScrollReveal(el, i % 2 === 0 ? "left" : "right", {
        delay: i * 0.07,
      });
    });
  }, []);

  return (
    <section ref={ref} className="onyx-section border-t border-onyx-border/60">
      <SectionHeader eyebrow="Style Stories" title="Editorial" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-5">
        {EDITORIALS_DATA.map((e, i) => (
          <div
            key={e.label}
            ref={(el) => (itemRefs.current[i] = el)}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer border border-onyx-border/60 bg-onyx-surface transition-colors duration-300 hover:border-onyx-gold/30"
          >
            <img
              src={e.img}
              alt={e.label}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-onyx-black/0 transition-colors duration-500 group-hover:bg-onyx-black/30" />
            <div className="absolute bottom-0 inset-x-0 p-4">
              <h3 className="font-serif text-base leading-snug text-onyx-text mb-0.5">
                {e.label}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.18em] text-onyx-gold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {e.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductRow = ({
  id,
  eyebrow,
  title,
  products,
  onNavigate,
  cols = 16,
  linkId,
  linkLabel,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) animateStaggerFadeUp(ref.current.children);
  }, [products]);

  if (!products || products.length === 0) return null;

  const colClass =
    {
      3: "grid-cols-2 sm:grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    }[cols] || "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <section id={id} className="onyx-section border-t border-onyx-border/60">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        linkId={linkId}
        linkLabel={linkLabel}
      />
      <div ref={ref} className={`grid gap-x-5 gap-y-10 ${colClass}`}>
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onClick={() => onNavigate(p._id)}
          />
        ))}
      </div>
    </section>
  );
};

const NewArrivalsCollection = ({ products = [], onNavigate }) => {
  const ref = useRef(null);

  useEffect(() => {
    const animation = animateStaggerFadeUp(ref.current?.children);
    return () => {
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section id="new-arrivals" className="onyx-section border-t border-onyx-border/60 py-14 sm:py-20 lg:py-28">
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10 md:mb-14">
        <div>
          <p className="onyx-eyebrow mb-2 sm:mb-3">Just Dropped</p>
          <h2 className="font-serif text-2xl font-light leading-tight tracking-tight text-onyx-text sm:text-3xl lg:text-4xl">
            New Arrivals
          </h2>
          <div className="onyx-divider" />
        </div>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("catalog-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="hidden items-center gap-2 pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-onyx-muted transition-colors hover:text-onyx-gold sm:inline-flex"
        >
          Explore collection <span aria-hidden="true">→</span>
        </button>
      </div>
      <div
        ref={ref}
        className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:auto-rows-[168px] sm:gap-5"
        aria-label="New arrivals product collage"
      >
        {products.slice(0, 5).map((product, index) => {
          const imageUrl = product.images?.[0]?.url;
          const collageSize = [
            "h-[228px] sm:col-span-2 sm:row-span-2 sm:h-full",
            "h-[184px] sm:col-span-2 sm:h-full",
            "h-[220px] sm:col-span-1 sm:h-full",
            "h-[184px] sm:col-span-1 sm:h-full",
            "h-[220px] sm:col-span-2 sm:h-full",
          ][index];

          return (
            <article
              key={product._id}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(product._id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onNavigate(product._id);
                }
              }}
              aria-label={`${product.title}, ${product.price?.currency || "INR"} ${product.price?.amount?.toLocaleString() || "0"}`}
              className={`group relative isolate cursor-pointer overflow-hidden rounded-sm border border-onyx-border/70 bg-onyx-surface outline-none focus-visible:ring-2 focus-visible:ring-onyx-gold ${collageSize}`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 bg-onyx-card" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              {index === 0 && (
                <span className="absolute left-3 top-3 rounded-full border border-onyx-gold/35 bg-onyx-black/70 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-onyx-gold backdrop-blur sm:left-4 sm:top-4 sm:text-[9px]">
                  New season
                </span>
              )}
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-onyx-gold/60 bg-onyx-black/45 text-lg font-light leading-none text-onyx-gold backdrop-blur transition-colors group-hover:bg-onyx-gold group-hover:text-onyx-black sm:right-4 sm:top-4">
                +
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="line-clamp-1 font-serif text-lg leading-tight text-white sm:text-xl">
                  {product.title}
                </h3>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-onyx-gold sm:text-[11px]">
                  {product.price?.currency === "INR"
                    ? "₹"
                    : product.price?.currency || ""}
                  {product.price?.amount?.toLocaleString() || "0"}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STYLE INSPIRATION BANNER (full-width mood)
───────────────────────────────────────────── */
const StyleInspiration = () => (
  <section className="relative py-0 overflow-hidden border-t border-onyx-border/60 lg:-mx-12 xl:-mx-20">
    <div
      className="relative h-[55vh] min-h-[360px] flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(6,6,10,0.92) 0%, rgba(6,6,10,0.6) 50%, rgba(6,6,10,0.3) 100%), url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop")`,
        backgroundSize: "cover",
        backgroundPosition: "center 35%",
      }}
    >
      <div className="text-center px-6 max-w-2xl mx-auto">
        <p className="onyx-eyebrow mb-4">Style Philosophy</p>
        <h2 className="font-serif text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-onyx-text mb-6">
          Wear what moves you.
          <br />
          <em className="not-italic text-onyx-gold">Leave the rest.</em>
        </h2>
        <p className="text-[14px] leading-relaxed text-onyx-muted max-w-md mx-auto">
          Fashion is not just clothing. It is the language of your identity.
          Discover pieces built for those who live with intention.
        </p>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   PROMO BANNER (Seller CTA + Free shipping)
   (styling only — icons now in gold-ring circles,
   CTA card gets a soft gold border glow on hover)
───────────────────────────────────────────── */
const PromoBanner = () => (
  <section className="py-12 lg:py-16 border-t border-onyx-border/60">
    {/* Perks strip */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-14">
      {PROMO_PERKS.map((p) => (
        <div
          key={p.title}
          className="flex items-center gap-4 rounded-xl border border-onyx-border/60 bg-onyx-surface p-5 transition-colors duration-300 hover:border-onyx-gold/25"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-onyx-gold/25 bg-onyx-gold/5 text-onyx-gold text-lg">
            {p.icon}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-onyx-text mb-1">
              {p.title}
            </p>
            <p className="text-[12px] leading-relaxed text-onyx-muted/70">
              {p.sub}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Seller CTA */}
    <div className="bg-onyx-card border border-white/5 rounded-2xl flex flex-col items-start justify-between gap-8 p-10 sm:p-14 lg:flex-row lg:items-center lg:p-16 transition-colors duration-300 hover:border-onyx-gold/20">
      <div>
        <p className="onyx-eyebrow mb-3">Partner with Onyx</p>
        <h2 className="max-w-md font-serif text-3xl font-light leading-tight text-onyx-text lg:text-4xl">
          Sell your curated pieces to a global luxury audience.
        </h2>
      </div>
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row">
        <NavLink to="/register" className="onyx-btn-primary !w-auto px-8">
          Become a Seller
        </NavLink>
        <NavLink to="/login" className="onyx-btn-secondary !w-auto px-8">
          Sign In
        </NavLink>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <section className="border-t border-onyx-border/60 py-20 lg:py-28 text-center">
      <p className="onyx-eyebrow mb-4">Stay in the archive</p>
      <h2 className="font-serif text-3xl lg:text-4xl font-light leading-tight tracking-tight text-onyx-text mb-4">
        New arrivals. Exclusive drops.
        <br />
        <span className="text-onyx-gold">Always first.</span>
      </h2>
      <p className="mb-10 text-[14px] leading-relaxed text-onyx-muted max-w-md mx-auto">
        Join the inner circle. No spam, only luxury.
      </p>

      {sent ? (
        <div className="inline-flex items-center gap-2 rounded-lg border border-onyx-gold/30 bg-onyx-gold/5 px-6 py-3 text-[13px] text-onyx-gold">
          <span>✓</span> You&apos;re on the list.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col sm:flex-row gap-3"
          noValidate
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="onyx-input flex-1"
          />
          <button type="submit" className="onyx-btn-primary !w-auto px-8">
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
};

/* ─────────────────────────────────────────────
   LUXURY FOOTER
───────────────────────────────────────────── */
const LuxuryFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-onyx-border/70 pt-16 pb-10">
      {/* Top row */}
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 mb-16">
        {FOOTER_COLS.map((col) => (
          <div key={col.heading}>
            <p className="onyx-eyebrow mb-5">{col.heading}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <NavLink
                      to={link.to}
                      className="text-[12px] tracking-wide text-onyx-muted/60 transition-colors hover:text-onyx-gold"
                    >
                      {link.label}
                    </NavLink>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => e.preventDefault()}
                      className="text-[12px] tracking-wide text-onyx-muted/60 transition-colors hover:text-onyx-gold"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-onyx-border/60" />

      {/* Bottom row */}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-serif text-xl font-semibold tracking-[0.08em] text-onyx-text">
            ONYX
          </span>
          <p className="mt-1 text-[11px] tracking-wide text-onyx-muted/50">
            Luxury fashion. Curated globally.
          </p>
        </div>
        <p className="text-[10px] tracking-wide text-onyx-muted/40">
          © {year} Onyx. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const ProductRowSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3">
        <div className="onyx-skeleton aspect-[3/4] w-full rounded-sm" />
        <div className="onyx-skeleton h-3 w-3/4 rounded" />
        <div className="onyx-skeleton h-2.5 w-1/2 rounded" />
      </div>
    ))}
  </div>
);

const Home = () => {
  const allProduct = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  // Sync category state with URL if it changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    handleGetAllProducts().finally(() => setLoading(false));
  }, [handleGetAllProducts]);

  const goTo = useCallback((id) => navigate(`/product/${id}`), [navigate]);

  const scrollTo = useCallback(
    (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    [],
  );

  // Deterministically derive sections from the single product array using useMemo
  const { featured, trending, newArrivals, bestSellers, total } =
    useMemo(() => {
      const products = allProduct || [];
      const len = products.length;
      return {
        total: len,
        featured: products.slice(0, 5),
        trending:
          len > 4 ? products.slice(4, 8) : products.slice(0, Math.min(4, len)),
        newArrivals: [...products].reverse().slice(0, 5),
        bestSellers: products.slice(Math.max(0, len - 16)),
      };
    }, [allProduct]);
  const hasProducts = total > 0;

  return (
    <Layout showLinks={true}>
      <Hero
        onShop={() => scrollTo("catalog-section")}
        onExplore={() => scrollTo("featured")}
      />

      <CategoryStrip
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* ── Search, Filter & Categories Catalog Section ── */}
      <ProductCatalogSection
        products={allProduct}
        loading={loading}
        onNavigate={goTo}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        initialSearch={urlSearch}
      />

      {loading ? (
        <section className="onyx-section">
          <div className="mb-10">
            <div className="onyx-skeleton h-3 w-24 rounded mb-3" />
            <div className="onyx-skeleton h-8 w-48 rounded" />
          </div>
          <ProductRowSkeleton count={4} />
        </section>
      ) : !hasProducts ? (
        <section className="onyx-section">
          <EmptyState
            eyebrow="Archive Empty"
            title="No pieces are currently available."
            body="New arrivals are added regularly. Check back soon or sign up to be notified."
            cta={{ label: "Become a Seller", to: "/register" }}
          />
        </section>
      ) : (
        <>
          <FeaturedCollection products={featured} onNavigate={goTo} />
          <EditorialGrid />
          <ProductRow
            id="trending"
            eyebrow="What's Hot"
            title="Trending Now"
            products={trending}
            onNavigate={goTo}
            cols={4}
          />
          <StyleInspiration />
          <NewArrivalsCollection
            products={newArrivals}
            onNavigate={goTo}
          />
          <ProductRow
            id="best-sellers"
            eyebrow="Community Favorites"
            title="Best Sellers"
            products={bestSellers}
            onNavigate={goTo}
            cols={4}
          />
        </>
      )}

      <PromoBanner />
      <Newsletter />
      <LuxuryFooter />
    </Layout>
  );
};

export default Home;
