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

const Layout = ({
  children,
  showLinks = false,
  showBackButton = false,
  transparentNav = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const cartCount =
    useSelector((state) => state.cart?.items?.items?.length) || 0;
  const wishlistCount = 
    useSelector((state) => state.wishlist?.wishlist?.length) || 0;
  const { handleGetCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  const logout = useCallback(async () => {
    setMobileMenuOpen(false);
    await handleLogout();
    navigate("/");
  }, [handleLogout, navigate]);

  const userDisplayName =
    user?.fullname || user?.name || user?.email || "Guest User";
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  const authStatusLabel = user ? "Signed in" : "Not signed in";

  useEffect(() => {
    if (!user) return;
    handleGetCart().catch(() => {
      // ignore fetch errors in header
    });
  }, [user, handleGetCart]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Navbar scroll effect
  useEffect(() => {
    return initNavbarScrollEffect(headerRef.current, 40);
  }, []);

  // Page transition in on each route change
  useEffect(() => {
    animatePageIn(contentRef.current);
  }, [location.pathname]);

  return (
    <div className="onyx-bg min-h-screen">
      <header
        ref={headerRef}
        className={`onyx-navbar sticky top-0 z-40 w-full transition-all duration-300 ${
          showLinks ? "justify-between" : "gap-3"
        }`}
      >
        <div className="onyx-container w-full flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-white/10 text-onyx-muted transition-all duration-300 hover:text-onyx-gold hover:border-onyx-gold/35 hover:bg-onyx-gold/5"
                type="button"
                aria-label="Go back"
              >
                ←
              </button>
            )}
            <Link
              to="/"
              className="text-xl font-semibold uppercase tracking-[0.08em] !text-onyx-text hover:!text-onyx-gold transition-colors font-serif no-underline shrink-0"
            >
              ONYX
            </Link>
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[320px] group items-end border-b border-onyx-gold/40 focus-within:border-onyx-gold transition-colors">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-transparent border-none py-1.5 px-2 text-[12px] !text-onyx-text outline-none placeholder:text-white/40 tracking-wider"
            />
            <button
              type="button"
              aria-label="Search"
              className="flex items-center justify-center w-7 h-7 shrink-0 bg-onyx-gold rounded-t-sm text-onyx-black hover:bg-onyx-gold-lt transition-colors shadow-[0_0_10px_rgba(196,154,82,0.3)]"
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

          <div className="ml-auto flex items-center gap-3">
            {/* Desktop Links inline */}
            <div
              className="hidden md:flex items-center gap-6 text-[11px] font-medium tracking-[0.12em] uppercase"
              aria-label="Main navigation"
            >
              {user?.role === "seller" && (
                <>
                  <NavLink
                    to="/seller/create-product"
                    className="onyx-nav-link whitespace-nowrap"
                  >
                    Upload
                  </NavLink>
                  <NavLink
                    to="/seller/dashboard"
                    className="onyx-nav-link whitespace-nowrap"
                  >
                    Dashboard
                  </NavLink>
                </>
              )}
              {user && (
                <>
                  <NavLink
                    to="/getYourList"
                    className="onyx-nav-link relative flex items-center gap-1.5 whitespace-nowrap"
                    aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                  >
                    <WishlistIcon />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c49a52] text-[#06060a] text-[9px] font-bold flex items-center justify-center leading-none">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/getyourcart"
                    className="onyx-nav-link relative flex items-center gap-1.5 whitespace-nowrap"
                    aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                  >
                    <Count isMobile={false} cartCount={cartCount} />
                  </NavLink>
                </>
              )}
            </div>

            <div className="relative hidden md:block">
              <div className="group relative">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#13131a]/80 text-[#eee9e1] transition-all duration-300 hover:border-[#c49a52]/35 hover:text-[#c49a52]"
                  aria-label="Open user menu"
                >
                  <span className="text-sm font-semibold uppercase">
                    {userInitial}
                  </span>
                </button>

                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#13131a] p-4 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#eee9e1]">
                    {userDisplayName}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#eee9e1]/70">
                    {authStatusLabel}
                  </p>

                  <div className="mt-4 flex flex-col gap-2 text-[11px] uppercase tracking-[0.12em] text-[#eee9e1]">
                    {!user ? (
                      <>
                        <NavLink
                          to="/login"
                          className="onyx-nav-link whitespace-nowrap"
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/register"
                          className="onyx-nav-link whitespace-nowrap"
                        >
                          Register
                        </NavLink>
                      </>
                    ) : (
                      <button
                        onClick={logout}
                        className="onyx-nav-link bg-transparent border-none cursor-pointer p-0 text-left whitespace-nowrap"
                        type="button"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="md:hidden flex items-center relative"
              ref={mobileMenuRef}
            >
              {/* Icons visible on mobile always */}
              {user && (
                <>
                  <NavLink
                    to="/getYourList"
                    className="onyx-nav-link relative flex items-center mr-3"
                    aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                  >
                    <WishlistIcon />
                    {wishlistCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-[#c49a52] text-[#06060a] text-[11px] font-bold leading-none">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/getyourcart"
                    className="onyx-nav-link relative flex items-center mr-2"
                    aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                  >
                    <Count isMobile={true} cartCount={cartCount} />
                  </NavLink>
                </>
              )}

              <button
                className="p-2 text-onyx-text hover:text-onyx-gold transition-colors"
                aria-label="Open mobile menu"
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {mobileMenuOpen ? (
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

              {mobileMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[min(280px,90vw)] rounded-2xl border border-white/10 bg-onyx-card p-5 shadow-2xl z-50">
                  <div className="mb-4 border-b border-onyx-border/70 pb-3">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-onyx-text">
                      {userDisplayName}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-onyx-muted">
                      {authStatusLabel}
                    </p>
                  </div>
                  <nav className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.12em]">
                    {user?.role === "seller" && (
                      <>
                        <NavLink
                          to="/seller/create-product"
                          onClick={() => setMobileMenuOpen(false)}
                          className="onyx-nav-link py-1"
                        >
                          Upload
                        </NavLink>
                        <NavLink
                          to="/seller/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="onyx-nav-link py-1"
                        >
                          Dashboard
                        </NavLink>
                      </>
                    )}
                    {!user ? (
                      <>
                        <NavLink
                          to="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="onyx-nav-link py-1"
                        >
                          Register
                        </NavLink>
                        <NavLink
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="onyx-nav-link py-1"
                        >
                          Sign In
                        </NavLink>
                      </>
                    ) : (
                      <button
                        onClick={logout}
                        className="onyx-nav-link bg-transparent border-none cursor-pointer p-0 text-left py-1 w-full"
                        type="button"
                      >
                        Logout
                      </button>
                    )}
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
