import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/hook/useAuth";
import { useCart } from "../cart/hooks/useCart";
import Count from "../cart/components/Count";
import { initNavbarScrollEffect, animatePageIn } from "./animations";

const WishlistIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchBar = ({ className }) => (
  <div
    className={`group flex items-end border-b border-onyx-gold/40 focus-within:border-onyx-gold transition-colors duration-150 ${className}`}
  >
    <input
      type="text"
      placeholder="Search for products..."
      className="w-full bg-transparent border-none py-1.5 px-2 text-[12px] !text-onyx-text outline-none placeholder:text-white/40 tracking-wider"
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
);

const Badge = ({ count }) =>
  count > 0 && (
    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c49a52] text-[#06060a] text-[9px] font-bold flex items-center justify-center leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );

const Layout = ({ children, showBackButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const cartCount =
    useSelector((state) => state.cart?.items?.items?.length) || 0;
  const wishlistCount =
    useSelector((state) => state.wishlist?.wishlist?.length) || 0;
  const { handleGetCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  const logout = useCallback(async () => {
    setMenuOpen(false);
    await handleLogout();
    navigate("/");
  }, [handleLogout, navigate]);

  useEffect(() => {
    user && handleGetCart().catch(() => {});
  }, [user, handleGetCart]);
  useEffect(() => initNavbarScrollEffect(headerRef.current, 40), []);
  useEffect(() => animatePageIn(contentRef.current), [location.pathname]);
  useEffect(() => {
    const clickOutside = (e) =>
      menuOpen &&
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      setMenuOpen(false);
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [menuOpen]);

  const navItemClass = (isMobile) =>
    `onyx-nav-link whitespace-nowrap ${isMobile ? "py-2" : ""}`;

  const AuthLinks = ({ isMobile }) => (
    <>
      {!user ? (
        <>
          <NavLink
            to="/register"
            onClick={() => setMenuOpen(false)}
            className={navItemClass(isMobile)}
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
            className={navItemClass(isMobile)}
          >
            Sign In
          </NavLink>
        </>
      ) : (
        <button
          onClick={logout}
          className={`${navItemClass(isMobile)} bg-transparent border-none cursor-pointer p-0 text-left ${isMobile && "w-full"}`}
          type="button"
        >
          Logout
        </button>
      )}
    </>
  );

  return (
    <div className="onyx-bg min-h-screen">
      <header
        ref={headerRef}
        className="onyx-navbar sticky top-0 z-40 w-full transition-all duration-150 py-2 lg:py-0"
      >
        <div className="onyx-container w-full flex flex-wrap items-center justify-between gap-y-3 relative lg:h-16">
          {/* Logo & Back */}
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-white/10 text-onyx-muted hover:text-onyx-gold hover:border-onyx-gold/35 hover:bg-onyx-gold/5 transition-all duration-150"
              >
                ←
              </button>
            )}
            <Link
              to="/"
              className="text-xl font-semibold uppercase tracking-[0.08em] !text-onyx-text hover:!text-onyx-gold transition-colors duration-150 font-serif no-underline"
            >
              ONYX
            </Link>
          </div>

          {/* Desktop Search */}
          <SearchBar className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px]" />

          {/* Mobile Search (Full Width, jumps to new row) */}
          <SearchBar className="flex lg:hidden w-full order-last mt-1" />

          {/* Navigation Items */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center gap-6 text-[11px] font-medium tracking-[0.12em] uppercase">
              {user?.role === "seller" && (
                <>
                  <NavLink
                    to="/seller/create-product"
                    className="onyx-nav-link"
                  >
                    Upload
                  </NavLink>
                  <NavLink to="/seller/dashboard" className="onyx-nav-link">
                    Dashboard
                  </NavLink>
                </>
              )}
              {user && (
                <>
                  <NavLink
                    to="/getYourList"
                    className="onyx-nav-link relative flex items-center gap-1.5"
                  >
                    <WishlistIcon />
                    <Badge count={wishlistCount} />
                  </NavLink>
                  <NavLink
                    to="/getyourcart"
                    className="onyx-nav-link relative flex items-center gap-1.5"
                  >
                    <Count isMobile={false} cartCount={cartCount} />
                  </NavLink>
                </>
              )}
            </div>

            {/* User Dropdown (Desktop) */}
            {user && (
              <div className="hidden lg:block relative group">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#13131a]/80 text-[#eee9e1] hover:border-[#c49a52]/35 hover:text-[#c49a52] transition-all duration-150"
                >
                  <span className="text-sm font-semibold uppercase">
                    {(user.fullname || user.name || user.email || "U")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#13131a] p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#eee9e1]">
                    {user.fullname || user.name || user.email}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#eee9e1]/70">
                    Signed in
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-[11px] uppercase tracking-[0.12em] text-[#eee9e1]">
                    <AuthLinks isMobile={false} />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu & Icons */}
            <div className="lg:hidden flex items-center relative" ref={menuRef}>
              {user && (
                <NavLink
                  to="/getYourList"
                  className="onyx-nav-link relative flex items-center mr-3"
                >
                  <WishlistIcon />
                  <Badge count={wishlistCount} />
                </NavLink>
              )}

              <button
                className="text-onyx-text hover:text-onyx-gold transition-colors duration-150"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {menuOpen ? (
                    <>
                      <line x1="4" y1="4" x2="20" y2="20" />
                      <line x1="20" y1="4" x2="4" y2="20" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="17" x2="20" y2="17" />
                    </>
                  )}
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-[min(280px,90vw)] rounded-2xl border border-white/10 bg-onyx-card p-5 shadow-2xl z-50">
                  <div className="mb-4 border-b border-onyx-border/70 pb-3">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-onyx-text">
                      {user?.fullname || user?.name || user?.email || "Guest"}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-onyx-muted">
                      {user ? "Signed in" : "Not signed in"}
                    </p>
                  </div>

                  <nav className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.12em]">
                    {user?.role === "seller" && (
                      <>
                        <NavLink
                          to="/seller/create-product"
                          onClick={() => setMenuOpen(false)}
                          className="onyx-nav-link py-2"
                        >
                          Upload
                        </NavLink>
                        <NavLink
                          to="/seller/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="onyx-nav-link py-2"
                        >
                          Dashboard
                        </NavLink>
                      </>
                    )}
                    {user && (
                      <NavLink
                        to="/getyourcart"
                        onClick={() => setMenuOpen(false)}
                        className="onyx-nav-link py-2 flex items-center justify-between"
                      >
                        <Count isMobile={true} cartCount={cartCount} />
                      </NavLink>
                    )}
                    <AuthLinks isMobile={true} />
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div ref={contentRef} className="onyx-container page-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
