import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Layout from "../../Shared/Layout";
import ProductCard from "../../Shared/ProductCard";
import EmptyState from "../../Shared/EmptyState";
import { animateHeroContent, animateStaggerFadeUp, animateFadeUp } from "../../Shared/animations";

const CATEGORIES = [
  { label: "Outerwear", sub: "Coats & Jackets" },
  { label: "Tailoring", sub: "Suits & Blazers" },
  { label: "Knitwear", sub: "Sweaters & Cardigans" },
  { label: "Denim", sub: "Jeans & Shorts" },
  { label: "Footwear", sub: "Shoes & Boots" },
  { label: "Accessories", sub: "Bags & Jewellery" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
];

const Hero = ({ onShop, onExplore }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    animateHeroContent(contentRef.current);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative flex min-h-[92vh] items-end overflow-hidden px-5 pb-16 pt-12 sm:px-8 sm:pb-24 lg:-mx-12 lg:px-12 xl:-mx-20 xl:px-20 bg-onyx-bg"
      aria-label="Hero"
    >
      {HERO_IMAGES.map((img, index) => (
        <img
          key={img}
          src={img}
          alt={`Hero ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="onyx-hero-overlay absolute inset-0 z-0" />

      <div ref={contentRef} className="relative z-10 max-w-2xl">
        <p className="onyx-eyebrow mb-5">New Season — 2026</p>
        <h1 className="onyx-page-title mb-6">
          Dressed in
          <br />
          <em className="not-italic text-onyx-gold">nothing but</em>
          <br />
          intention.
        </h1>
        <p className="mb-10 max-w-md text-[15px] leading-relaxed text-onyx-muted">
          Curated luxury fashion. Every piece, an expression. Discover the
          archive.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onShop}
            className="onyx-btn-primary w-auto px-10 py-4"
          >
            Shop Collection
          </button>
          <button
            onClick={onExplore}
            className="onyx-btn-secondary w-auto px-10 py-4"
          >
            Explore Archive
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 opacity-30 md:flex">
        <div className="h-12 w-px bg-onyx-text" />
        <span className="origin-bottom rotate-90 text-[9px] uppercase tracking-[0.2em] text-onyx-text">
          Scroll
        </span>
      </div>
    </section>
  );
};

const CategoriesStrip = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      animateStaggerFadeUp(containerRef.current.children);
    }
  }, []);

  return (
    <section className="onyx-section-sm border-y border-onyx-border/70 bg-onyx-bg px-5 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-20 xl:px-20">
      <div ref={containerRef} className="grid grid-cols-3 gap-0 md:grid-cols-6">
        {CATEGORIES.map((cat, i) => (
        <div
          key={cat.label}
          className={`group flex cursor-pointer flex-col gap-1 px-4 py-6 transition-colors duration-300 hover:bg-onyx-gold/10 ${
            i < CATEGORIES.length - 1 ? "border-r border-onyx-border/70" : ""
          }`}
        >
          <span className="font-serif text-[1.05rem] font-medium text-onyx-text/80 transition-colors group-hover:text-onyx-text">
            {cat.label}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-onyx-muted/70">
            {cat.sub}
          </span>
        </div>
      ))}
    </div>
  </section>
  );
};

const FeaturedEditorial = ({ products, onNavigate }) => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    animateFadeUp(sectionRef.current);
  }, []);

  if (!products || products.length < 2) return null;
  const [hero, ...rest] = products.slice(0, 4);
  const heroImg = hero.images?.[0]?.url;

  return (
    <section ref={sectionRef} className="onyx-section">
      <div className="mb-10 flex items-end justify-between sm:mb-14">
        <div>
          <p className="onyx-eyebrow mb-3">Curated Selection</p>
          <h2 className="onyx-section-title">Featured Pieces</h2>
          <div className="onyx-divider" />
        </div>
        <button
          onClick={() =>
            document
              .getElementById("all-products")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-onyx-muted transition-colors hover:text-onyx-gold sm:block"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div
          className="group cursor-pointer sm:row-span-2"
          onClick={() => onNavigate(hero._id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate(hero._id)}
          aria-label={hero.title}
        >
          <div className="relative aspect-[3/4] min-h-[400px] overflow-hidden rounded-2xl border border-onyx-border/70 bg-onyx-surface sm:h-full">
            {heroImg ? (
              <img
                src={heroImg}
                alt={hero.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-onyx-muted/40">
                  No Image
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5">
              <h3 className="mb-1 font-serif text-lg leading-tight text-onyx-text">
                {hero.title}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-onyx-gold">
                {hero.price?.currency || "INR"}{" "}
                {hero.price?.amount?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        {rest.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => onNavigate(product._id)}
          />
        ))}
      </div>
    </section>
  );
};

const ProductGrid = ({ products, onNavigate }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current) {
      animateStaggerFadeUp(gridRef.current.children);
    }
  }, [products]);

  return (
    <section
      id="all-products"
      className="onyx-section border-t border-onyx-border/60"
    >
      <div className="mb-10 flex items-end justify-between sm:mb-14">
        <div>
          <p className="onyx-eyebrow mb-3">The Archive</p>
          <h2 className="onyx-section-title">All Products</h2>
          <div className="onyx-divider" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.12em] text-onyx-muted/60">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => onNavigate(product._id)}
          />
        ))}
      </div>
    </section>
  );
};

const SellerCTA = () => (
  <section className="onyx-section-sm border-t border-onyx-border/60">
    <div className="onyx-card-elevated flex flex-col items-start justify-between gap-8 rounded-2xl p-10 sm:p-14 lg:flex-row lg:items-center lg:p-20">
      <div>
        <p className="onyx-eyebrow mb-3">Partner with Onyx</p>
        <h2 className="max-w-md font-serif text-3xl font-light leading-tight text-onyx-text lg:text-4xl">
          Sell your curated pieces to a global luxury audience.
        </h2>
      </div>
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row">
        <NavLink to="/register" className="onyx-btn-primary w-auto px-8">
          Become a Seller
        </NavLink>
        <NavLink to="/login" className="onyx-btn-secondary w-auto px-8">
          Sign In
        </NavLink>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-onyx-border/70 py-12">
    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <span className="font-serif text-xl font-semibold tracking-[0.08em] text-onyx-text">
          ONYX
        </span>
        <p className="mt-1.5 text-[11px] tracking-wide text-onyx-muted/70">
          Luxury fashion. Curated globally.
        </p>
      </div>
      <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.14em] text-onyx-muted/60">
        <NavLink to="/" className="transition-colors hover:text-onyx-gold">
          Shop
        </NavLink>
        <NavLink to="/login" className="transition-colors hover:text-onyx-gold">
          Sign In
        </NavLink>
        <NavLink
          to="/register"
          className="transition-colors hover:text-onyx-gold"
        >
          Register
        </NavLink>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="transition-colors hover:text-onyx-gold"
        >
          Privacy
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="transition-colors hover:text-onyx-gold"
        >
          Terms
        </a>
      </div>
    </div>
    <div className="mt-8 border-t border-onyx-border/60 pt-6 text-[10px] tracking-wide text-onyx-muted/50">
      © {new Date().getFullYear()} Onyx. All rights reserved.
    </div>
  </footer>
);

const Home = () => {
  const allProduct = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, [handleGetAllProducts]);

  const scrollToProducts = () => {
    document
      .getElementById("all-products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout showLinks={true}>
      <Hero onShop={scrollToProducts} onExplore={scrollToProducts} />
      <CategoriesStrip />

      {allProduct && allProduct.length > 0 ? (
        <>
          <FeaturedEditorial
            products={allProduct}
            onNavigate={(id) => navigate(`/product/${id}`)}
          />
          <ProductGrid
            products={allProduct}
            onNavigate={(id) => navigate(`/product/${id}`)}
          />
        </>
      ) : (
        <section className="onyx-section">
          <EmptyState
            eyebrow="Archive Empty"
            title="No pieces are currently available."
            body="New arrivals are added regularly. Check back soon or sign up to be notified."
          />
        </section>
      )}

      <SellerCTA />
      <Footer />
    </Layout>
  );
};

export default Home;
