import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { debounce } from "lodash";

const SearchBar = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Get products from Redux or API
  const products = useSelector((state) => state.product?.products || []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, availableProducts) => {
      if (term.trim().length > 0) {
        performSearch(term, availableProducts);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300),
    [],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  // Perform search
  const performSearch = async (term, availableProducts = products) => {
    setIsLoading(true);
    try {
      // // Option 1: Search from Redux (if products already loaded)
      const filtered = availableProducts.filter(
        (product) =>
          product.title?.toLowerCase().includes(term.toLowerCase()) ||
          product.category?.toLowerCase().includes(term.toLowerCase()) ||
          product.description?.toLowerCase().includes(term.toLowerCase()),
      );
      setResults(filtered.slice(0, 10));
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value, products);
  };

  // Handle result click
  const handleResultClick = (productId) => {
    setShowResults(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  // Close results on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={`search-container relative ${className}`}>
      <div className="group flex items-end border-b border-onyx-gold/40 focus-within:border-onyx-gold transition-colors duration-150">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for products..."
          className="w-full bg-transparent border-none py-1.5 px-2 text-[12px] !text-onyx-text outline-none placeholder:text-white/40 tracking-wider"
          onFocus={() => searchTerm && setShowResults(true)}
        />
        <button
          type="button"
          aria-label="Search"
          className="flex items-center justify-center w-7 h-7 shrink-0 bg-onyx-gold rounded-t-sm text-onyx-black hover:bg-onyx-gold-lt transition-colors duration-150 shadow-[0_0_10px_rgba(196,154,82,0.3)]"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#13131a] border border-white/10 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-[#eee9e1]/70 text-sm">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleResultClick(product._id)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                >
                  <div className="flex items-center gap-3">
                    {product.images?.[0]?.url && (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#eee9e1] truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-[#c49a52]">
                        {product.price?.currency || "INR"}{" "}
                        {product.price?.amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.length > 0 ? (
            <div className="p-4 text-center text-[#eee9e1]/50 text-sm">
              No products found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
