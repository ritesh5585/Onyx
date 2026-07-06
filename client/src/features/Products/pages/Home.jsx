import React, { useEffect } from "react";
import { useNavigate, NavLink } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Layout from "../../Shared/Layout";
import ProductCard from "../../Shared/ProductCard";
import EmptyState from "../../Shared/EmptyState";

/* ── Category data (presentational) ── */
const CATEGORIES = [
  { label: "Outerwear", sub: "Coats & Jackets" },
  { label: "Tailoring", sub: "Suits & Blazers" },
  { label: "Knitwear", sub: "Sweaters & Cardigans" },
  { label: "Denim", sub: "Jeans & Shorts" },
  { label: "Footwear", sub: "Shoes & Boots" },
  { label: "Accessories", sub: "Bags & Jewellery" },
];

/* ── Hero Section ── */
const Hero = ({ onShop, onExplore }) => (
  <section
    className="relative min-h-[92vh] flex items-end pb-16 md:pb-24 -mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-20 px-5 sm:px-8 lg:px-12 xl:px-20"
    aria-label="Hero"
  >
    {/* Background image */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to top, rgba(6,6,10,1) 0%, rgba(6,6,10,0.75) 35%, rgba(6,6,10,0.25) 70%, transparent 100%),
          linear-gradient(to right, rgba(6,6,10,0.6) 0%, transparent 60%),
          url("https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
      }}
    />

    {/* Content */}
    <div className="relative z-10 max-w-2xl">
      <p className="onyx-eyebrow mb-5">New Season — 2026</p>
      <h1 className="onyx-page-title mb-6">
        Dressed in
        <br />
        <em className="text-[#c49a52] not-italic">nothing but</em>
        <br />
        intention.
      </h1>
      <p
        className="text-[15px] leading-relaxed mb-10 max-w-md"
        style={{ color: "rgba(238,233,225,0.55)" }}
      >
        Curated luxury fashion. Every piece, an expression. Discover the
        archive.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={onShop}
          className="onyx-btn-primary !w-auto px-10 py-4"
        >
          Shop Collection
        </button>
        <button
          onClick={onExplore}
          className="onyx-btn-secondary !w-auto px-10 py-4"
        >
          Explore Archive
        </button>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 opacity-30">
      <div className="w-px h-12 bg-[#eee9e1]" />
      <span className="text-[9px] uppercase tracking-[0.2em] rotate-90 origin-bottom text-[#eee9e1]">
        Scroll
      </span>
    </div>
  </section>
);

/* ── Categories Strip ── */
const CategoriesStrip = () => (
  <section className="onyx-section-sm border-y border-[rgba(255,255,255,0.06)] -mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-20 px-5 sm:px-8 lg:px-12 xl:px-20">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-0">
      {CATEGORIES.map((cat, i) => (
        <div
          key={cat.label}
          className={`flex flex-col gap-1 py-6 px-4 cursor-pointer group transition-colors duration-300 hover:bg-[rgba(196,154,82,0.04)] ${
            i < CATEGORIES.length - 1
              ? "border-r border-[rgba(255,255,255,0.06)]"
              : ""
          }`}
        >
          <span
            className="text-sm font-medium text-[rgba(238,233,225,0.8)] group-hover:text-[#eee9e1] transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.05rem",
            }}
          >
            {cat.label}
          </span>
          <span className="text-[10px] text-[rgba(238,233,225,0.3)] tracking-wide">
            {cat.sub}
          </span>
        </div>
      ))}
    </div>
  </section>
);

/* ── Featured Editorial (top 4 products) ── */
const FeaturedEditorial = ({ products, onNavigate }) => {
  if (!products || products.length < 2) return null;
  const [hero, ...rest] = products.slice(0, 4);
  const heroImg = hero.images?.[0]?.url;

  return (
    <section className="onyx-section">
      <div className="flex items-end justify-between mb-10 sm:mb-14">
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
          className="hidden sm:block text-[11px] uppercase tracking-[0.16em] font-medium text-[rgba(238,233,225,0.45)] hover:text-[#c49a52] transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Hero card — spans 2 rows on large */}
        <div
          className="sm:row-span-2 group cursor-pointer"
          onClick={() => onNavigate(hero._id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onNavigate(hero._id)}
          aria-label={hero.title}
        >
          <div className="aspect-[3/4] sm:h-full min-h-[400px] bg-[#0d0d12] overflow-hidden relative border border-[rgba(255,255,255,0.05)]">
            {heroImg ? (
              <img
                src={heroImg}
                alt={hero.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[rgba(238,233,225,0.2)]">
                  No Image
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-[rgba(6,6,10,0)] group-hover:bg-[rgba(6,6,10,0.15)] transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[rgba(6,6,10,0.9)] to-transparent">
              <h3
                className="text-lg text-[#eee9e1] leading-tight mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                }}
              >
                {hero.title}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#c49a52] font-semibold">
                {hero.price?.currency || "INR"}{" "}
                {hero.price?.amount?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Remaining cards */}
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

/* ── All Products Grid ── */
const ProductGrid = ({ products, onNavigate }) => (
  <section
    id="all-products"
    className="onyx-section border-t border-[rgba(255,255,255,0.05)]"
  >
    <div className="flex items-end justify-between mb-10 sm:mb-14">
      <div>
        <p className="onyx-eyebrow mb-3">The Archive</p>
        <h2 className="onyx-section-title">All Products</h2>
        <div className="onyx-divider" />
      </div>
      <span className="text-[11px] uppercase tracking-[0.12em] text-[rgba(238,233,225,0.35)]">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
      </span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
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

/* ── Seller CTA ── */
const SellerCTA = () => (
  <section className="onyx-section-sm border-t border-[rgba(255,255,255,0.05)]">
    <div className="bg-[#0d0d12] border border-[rgba(255,255,255,0.07)] rounded-2xl p-10 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <p className="onyx-eyebrow mb-3">Partner with Onyx</p>
        <h2
          className="text-3xl lg:text-4xl font-light text-[#eee9e1] leading-tight max-w-md"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Sell your curated pieces to a global luxury audience.
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
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

/* ── Footer ── */
const Footer = () => (
  <footer className="border-t border-[rgba(255,255,255,0.06)] py-12">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <span
          className="text-xl font-semibold text-[#eee9e1] tracking-[0.08em]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          ONYX
        </span>
        <p className="text-[11px] text-[rgba(238,233,225,0.3)] mt-1.5 tracking-wide">
          Luxury fashion. Curated globally.
        </p>
      </div>
      <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.14em] text-[rgba(238,233,225,0.35)]">
        <NavLink to="/" className="hover:text-[#c49a52] transition-colors">
          Shop
        </NavLink>
        <NavLink to="/login" className="hover:text-[#c49a52] transition-colors">
          Sign In
        </NavLink>
        <NavLink
          to="/register"
          className="hover:text-[#c49a52] transition-colors"
        >
          Register
        </NavLink>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#c49a52] transition-colors"
        >
          Privacy
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#c49a52] transition-colors"
        >
          Terms
        </a>
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.04)] text-[10px] text-[rgba(238,233,225,0.2)] tracking-wide">
      © {new Date().getFullYear()} Onyx. All rights reserved.
    </div>
  </footer>
);

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
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
      {/* Hero */}
      <Hero onShop={scrollToProducts} onExplore={scrollToProducts} />

      {/* Categories Strip */}
      <CategoriesStrip />

      {/* Products Content */}
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

      {/* Seller CTA */}
      <SellerCTA />

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Home;
