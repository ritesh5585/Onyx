import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/hook/useAuth";
import { useCart } from "../cart/hooks/useCart";
import Count from "../cart/components/Count";

const CartLink = ({ cartCount, isMobile }) => (
  <NavLink
    to="/getyourcart"
    className="onyx-nav-link relative flex items-center gap-1.5 whitespace-nowrap"
    aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
  >
    <Count isMobile={isMobile} cartCount={cartCount} />
  </NavLink>
);

const DesktopLinks = ({ user, cartCount }) => (
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

    {user && <CartLink cartCount={cartCount} isMobile={false} />}
  </div>
);

const MobileMenuItems = ({ user, cartCount, logout }) => (
  <>
    {user && <CartLink cartCount={cartCount} isMobile={true} />}

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

    {user && (
      <button
        onClick={logout}
        className="onyx-nav-link bg-transparent border-none cursor-pointer p-0 text-left whitespace-nowrap"
        type="button"
      >
        Logout
      </button>
    )}
  </>
);

const Layout = ({ children, showLinks = false, showBackButton = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.cart.items) || {};
  const cartItems = cartData.items || [];
  const { handleLogout } = useAuth();
  const { handleGetCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const logout = useCallback(async () => {
    setMobileMenuOpen(false);
    await handleLogout();
    navigate("/");
  }, [handleLogout, navigate]);

  const cartCount = cartItems.length;
  const userInitial = useMemo(() => {
    const displayName = user?.fullname || user?.name || user?.email;
    return displayName?.charAt(0).toUpperCase() || "U";
  }, [user]);

  const userDisplayName = useMemo(
    () => user?.fullname || user?.name || user?.email || "Guest User",
    [user],
  );

  const authStatusLabel = useMemo(
    () => (user ? "Signed in" : "Not signed in"),
    [user],
  );

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
          <div className="ml-auto flex items-center gap-3">
            <DesktopLinks user={user} cartCount={cartCount} />

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
              <button
                className="text-[#eee9e1] p-2 hover:text-[#c49a52] transition-colors"
                aria-label="Open mobile menu"
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
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
              </button>

              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#13131a] p-5 shadow-2xl z-50">
                  <div className="mb-4 border-b border-white/10 pb-3">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-[#eee9e1]">
                      {userDisplayName}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#eee9e1]/70">
                      {authStatusLabel}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.12em] text-[#eee9e1]">
                    <MobileMenuItems
                      user={user}
                      cartCount={cartCount}
                      logout={logout}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <div className="onyx-container">{children}</div>
    </div>
  );
};

export default Layout;
