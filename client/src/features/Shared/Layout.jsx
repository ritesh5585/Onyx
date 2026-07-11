import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/hook/useAuth";
import { useCart } from "../cart/hooks/useCart";
import Count from "../cart/components/Count";

const NavLinks = ({ user, cartCount, handleLogout, navigate, isMobile }) => (
  <>
    {!user && (
      <>
        <NavLink to="/register" className="onyx-nav-link whitespace-nowrap">
          Register
        </NavLink>
        <NavLink to="/login" className="onyx-nav-link whitespace-nowrap">
          Sign In
        </NavLink>
      </>
    )}

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
          to="/getyourcart"
          className="onyx-nav-link relative flex items-center gap-1.5 whitespace-nowrap"
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        >
          <Count isMobile={isMobile} cartCount={cartCount} />
        </NavLink>

        <button
          onClick={async () => {
            await handleLogout();
            navigate("/");
          }}
          className="onyx-nav-link bg-transparent border-none cursor-pointer p-0 text-left whitespace-nowrap"
          type="button"
        >
          Logout
        </button>
      </>
    )}
  </>
);

const Layout = ({ children, showLinks = false, showBackButton = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const { handleLogout } = useAuth();
  const { handleGetCart } = useCart();

  const cartCount = cartItems.length;

  useEffect(() => {
    if (!user) return;
    handleGetCart().catch(() => {
      // ignore fetch errors in header
    });
  }, [user, handleGetCart]);

  return (
    <div className="onyx-bg min-h-screen">
      {/* ── Navbar — full-width with blur, content inside container ── */}
      <header
        className={`onyx-navbar sticky top-0 z-40 w-full ${
          showLinks ? "justify-between" : "gap-3"
        }`}
      >
        <div
          className={`onyx-container w-full flex items-center ${
            showLinks ? "justify-between" : "gap-2 sm:gap-4"
          }`}
        >
          {/* Left — back button or logo */}
          {showLinks ? (
            <NavLink
              to="/"
              className="text-xl font-semibold uppercase tracking-[0.08em] text-[#eee9e1] font-serif no-underline"
            >
              ONYX
            </NavLink>
          ) : (
            <>
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="text-2xl leading-none flex items-center justify-center w-8 h-8 rounded-full border border-white/8 text-[#eee9e1]/45 transition-all duration-300 hover:text-[#c49a52] hover:border-[#c49a52]/35 hover:bg-[#c49a52]/5"
                  type="button"
                  aria-label="Go back"
                >
                  ←
                </button>
              )}
              <NavLink
                to="/"
                className="text-lg font-semibold uppercase tracking-[0.08em] text-[#eee9e1] font-serif no-underline"
              >
                ONYX
              </NavLink>
            </>
          )}

          {/* Right — nav links */}
          {showLinks && (
            <>
              {/* Desktop Nav */}
              <nav
                className="hidden md:flex items-center gap-6 text-[11px] font-medium tracking-[0.12em] uppercase"
                aria-label="Main navigation"
              >
                <NavLinks
                  user={user}
                  cartCount={cartCount}
                  handleLogout={handleLogout}
                  navigate={navigate}
                  isMobile={false}
                />
              </nav>

              {/* Mobile Nav */}
              <div className="md:hidden flex items-center relative group">
                <button
                  className="text-[#eee9e1] p-2 hover:text-[#c49a52] transition-colors relative"
                  aria-label="Menu"
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
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#c49a52] text-[#06060a] text-[9px] font-bold flex items-center justify-center leading-none">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>

                {/* Hover Popup */}
                <div className="absolute top-full right-0 mt-2 w-max min-w-[140px] bg-[#13131a] border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col p-5 gap-5 text-[11px] font-medium tracking-[0.12em] uppercase z-50">
                  <NavLinks
                    user={user}
                    cartCount={cartCount}
                    handleLogout={handleLogout}
                    navigate={navigate}
                    isMobile={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Page Content ── */}
      <div className="onyx-container">{children}</div>
    </div>
  );
};

export default Layout;
