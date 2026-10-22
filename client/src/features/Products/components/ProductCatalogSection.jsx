import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import { animateStaggerFadeUp } from "../../Shared/animations";
import { debounce } from "lodash";

const CATEGORIES_LIST = [
  { label: "All", icon: "✦" },
  { label: "Outerwear", icon: "🧥", sub: "Coats & Jackets" },
  { label: "Tailoring", icon: "👔", sub: "Suits & Blazers" },
  { label: "Knitwear", icon: "🧣", sub: "Sweaters & Knits" },
  { label: "Denim", icon: "👖", sub: "Jeans & Tops" },
  { label: "Footwear", icon: "👞", sub: "Shoes & Boots" },
  { label: "Accessories", icon: "👜", sub: "Bags & Accs" },
];

const PRICE_PRESETS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹2,000", min: "", max: "2000" },
  { label: "₹2,000 – ₹5,000", min: "2000", max: "5000" },
  { label: "₹5,000 – ₹10,000", min: "5000", max: "10000" },
  { label: "Above ₹10,000", min: "10000", max: "" },
];

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "title_asc" },
];

const ProductCatalogSection = ({
  products = [],
  loading = false,
  onNavigate,
  activeCategory = "All",
  onSelectCategory,
  initialSearch = "",
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [pricePreset, setPricePreset] = useState("All Prices");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const gridRef = useRef(null);

  // Sync external category changes (e.g. from Hero CategoryStrip)
  useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);

  // Sync initialSearch if prop changes (e.g. from URL search params)
  useEffect(() => {
    if (initialSearch !== undefined && initialSearch !== searchTerm) {
      setSearchTerm(initialSearch);
      setDebouncedQuery(initialSearch);
    }
  }, [initialSearch]);

  // Debounced search term updater
  const debouncedHandler = useMemo(
    () =>
      debounce((val) => {
        setDebouncedQuery(val);
      }, 300),
    []
  );

  useEffect(() => () => debouncedHandler.cancel(), [debouncedHandler]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedHandler(val);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedQuery("");
    debouncedHandler.cancel();
  };

  const handleCategoryClick = (catLabel) => {
    const next = selectedCategory === catLabel && catLabel !== "All" ? "All" : catLabel;
    setSelectedCategory(next);
    onSelectCategory?.(next);
  };

  const handlePricePresetSelect = (preset) => {
    setPricePreset(preset.label);
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
  };

  const handleCustomPriceChange = (type, val) => {
    setPricePreset("Custom");
    if (type === "min") setMinPrice(val);
    if (type === "max") setMaxPrice(val);
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setDebouncedQuery("");
    setSelectedCategory("All");
    setPricePreset("All Prices");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    onSelectCategory?.("All");
  };

  // Notify parent if onFilterChange is passed (for backend fetching or logging)
  useEffect(() => {
    onFilterChange?.({
      search: debouncedQuery,
      category: selectedCategory,
      minPrice,
      maxPrice,
      sortBy,
    });
  }, [debouncedQuery, selectedCategory, minPrice, maxPrice, sortBy, onFilterChange]);

  // Client-side filtering & sorting for instantaneous feedback on available products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let list = [...products];

    // Search query filter
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Min price
    if (minPrice !== "" && !isNaN(Number(minPrice))) {
      list = list.filter((p) => (p.price?.amount || 0) >= Number(minPrice));
    }

    // Max price
    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      list = list.filter((p) => (p.price?.amount || 0) <= Number(maxPrice));
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = a.price?.amount || 0;
      const priceB = b.price?.amount || 0;
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      if (sortBy === "title_asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      // default newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [products, debouncedQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  // Animate grid cards when filtered list changes
  useEffect(() => {
    if (gridRef.current?.children?.length > 0) {
      animateStaggerFadeUp(gridRef.current.children);
    }
  }, [filteredProducts]);

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedQuery.trim()) count++;
    if (selectedCategory !== "All") count++;
    if (minPrice !== "" || maxPrice !== "") count++;
    if (sortBy !== "newest") count++;
    return count;
  }, [debouncedQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  const hasAnyFilter = activeFiltersCount > 0;

  return (
    <section id="catalog-section" className="onyx-section border-t border-onyx-border/70 scroll-mt-20">
      {/* ── Section Header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="onyx-eyebrow">The Curated Archive</span>
            <span className="h-1 w-1 rounded-full bg-onyx-gold/60" />
            <span className="text-[11px] font-mono tracking-wider text-onyx-gold">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-tight text-onyx-text">
            Search & Filter Archive
          </h2>
          <div className="onyx-divider" />
        </div>

        {/* Filter Toggle + Sort dropdown (Desktop right) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFilterPanelOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer ${
              isFilterPanelOpen || activeFiltersCount > 0
                ? "border-onyx-gold bg-onyx-gold/10 text-onyx-gold shadow-[0_0_12px_rgba(196,154,82,0.15)]"
                : "border-onyx-border/80 bg-onyx-surface text-onyx-text/80 hover:border-onyx-gold/40 hover:text-onyx-gold"
            }`}
            aria-expanded={isFilterPanelOpen}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-onyx-gold text-onyx-black text-[9px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-onyx-surface border border-onyx-border/80 text-onyx-text/90 rounded-lg pl-3 pr-8 py-2.5 text-[11px] font-medium tracking-wide outline-none focus:border-onyx-gold transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-onyx-surface text-onyx-text">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-onyx-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Input Bar ── */}
      <div className="mb-6 relative">
        <div className="relative flex items-center w-full rounded-xl border border-onyx-border/80 bg-onyx-surface/80 backdrop-blur-sm px-4 py-3 shadow-inner focus-within:border-onyx-gold/80 focus-within:ring-1 focus-within:ring-onyx-gold/30 transition-all duration-200">
          <svg
            className="w-4 h-4 text-onyx-gold shrink-0 mr-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search archive by keyword, silhouette, tailoring, fabric..."
            className="w-full bg-transparent border-none text-sm text-onyx-text placeholder:text-onyx-muted/50 outline-none tracking-wide"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-onyx-muted hover:text-onyx-text text-xs p-1 ml-2 transition-colors cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Navigation Tabs / Pills ── */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.label.toLowerCase();
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => handleCategoryClick(cat.label)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-onyx-gold text-onyx-black font-semibold shadow-[0_0_15px_rgba(196,154,82,0.3)] scale-[1.02]"
                  : "border border-onyx-border/70 bg-onyx-surface text-onyx-text/75 hover:border-onyx-gold/40 hover:text-onyx-text"
              }`}
            >
              <span className="text-xs">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Expandable Filter Drawer (Price & Range) ── */}
      {isFilterPanelOpen && (
        <div className="mb-8 rounded-2xl border border-onyx-border/80 bg-onyx-surface/90 p-5 sm:p-6 backdrop-blur-md transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Presets */}
            <div>
              <p className="onyx-label mb-3">Price Range Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((p) => {
                  const isSelected = pricePreset === p.label;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handlePricePresetSelect(p)}
                      className={`rounded-lg px-3 py-1.5 text-[11px] tracking-wide transition-all cursor-pointer ${
                        isSelected
                          ? "border border-onyx-gold bg-onyx-gold/15 text-onyx-gold font-semibold"
                          : "border border-white/5 bg-black/30 text-onyx-muted hover:border-white/20 hover:text-onyx-text"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Min / Max Price Inputs */}
            <div>
              <p className="onyx-label mb-3">Custom Price (INR)</p>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-muted text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => handleCustomPriceChange("min", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-xs text-onyx-text placeholder:text-onyx-muted/40 outline-none focus:border-onyx-gold"
                  />
                </div>
                <span className="text-onyx-muted text-xs">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-onyx-muted text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => handleCustomPriceChange("max", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-xs text-onyx-text placeholder:text-onyx-muted/40 outline-none focus:border-onyx-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filters Chips Bar ── */}
      {hasAnyFilter && (
        <div className="mb-6 flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-[10px] uppercase tracking-[0.16em] text-onyx-muted mr-1">
            Active:
          </span>

          {debouncedQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-onyx-gold/30 bg-onyx-gold/10 px-3 py-1 text-[11px] text-onyx-gold">
              <span>Search: "{debouncedQuery.trim()}"</span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove search"
              >
                ✕
              </button>
            </span>
          )}

          {selectedCategory !== "All" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-onyx-gold/30 bg-onyx-gold/10 px-3 py-1 text-[11px] text-onyx-gold">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => handleCategoryClick("All")}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove category filter"
              >
                ✕
              </button>
            </span>
          )}

          {(minPrice !== "" || maxPrice !== "") && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-onyx-gold/30 bg-onyx-gold/10 px-3 py-1 text-[11px] text-onyx-gold">
              <span>
                Price: {minPrice ? `₹${Number(minPrice).toLocaleString()}` : "₹0"} –{" "}
                {maxPrice ? `₹${Number(maxPrice).toLocaleString()}` : "Any"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPricePreset("All Prices");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove price filter"
              >
                ✕
              </button>
            </span>
          )}

          {sortBy !== "newest" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-onyx-text/80">
              <span>Sort: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span>
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className="hover:text-white transition-colors cursor-pointer"
                title="Reset sort"
              >
                ✕
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAll}
            className="text-[11px] uppercase tracking-wider text-onyx-gold underline hover:text-white transition-colors ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ── Products Grid or Empty State ── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="onyx-skeleton aspect-[3/4] w-full rounded-sm" />
              <div className="onyx-skeleton h-3 w-3/4 rounded" />
              <div className="onyx-skeleton h-2.5 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12">
          <EmptyState
            eyebrow="NO PIECES MATCH"
            title="The archive yielded no results."
            body="Try loosening your search terms or resetting the active filters to explore more curated garments."
            cta={{
              label: "Reset All Filters",
              onClick: handleResetAll,
            }}
          />
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4"
        >
          {filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onClick={() => onNavigate(p._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductCatalogSection;
