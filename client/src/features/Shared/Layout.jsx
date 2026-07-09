import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/hook/useAuth";

const CartIcon = () => (
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
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Layout = ({ children, showLinks = false, showBackButton = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const { handleLogout } = useAuth();

  const cartCount = cartItems.length;

  return (
    <div className="onyx-bg min-h-screen">
      {/* ── Navbar — full-width with blur, content inside container ── */}
      <header
        className={`onyx-navbar sticky top-0 z-40 w-full ${
          showLinks ? "justify-between" : "gap-4"
        }`}
      >
        <div
          className={`onyx-container w-full flex items-center ${
            showLinks ? "justify-between" : "gap-4"
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
                  className="text-xl leading-none flex items-center justify-center w-9 h-9 rounded-full border border-white/5 text-[#eee9e1]/35 transition-all duration-300 hover:text-[#c49a52] hover:border-[#c49a52]/35 hover:bg-[#c49a52]/5"
                  type="button"
                  aria-label="Go back"
                >
                  ←
                </button>
              )}
              <NavLink
                to="/"
                className="text-xl font-semibold uppercase tracking-[0.08em] text-[#eee9e1] font-serif no-underline"
              >
                ONYX
              </NavLink>
            </>
          )}

          {/* Right — nav links */}
          {showLinks && (
            <nav className="flex items-center gap-6 text-[11px] font-medium tracking-[0.12em] uppercase" aria-label="Main navigation">
              {!user && (
                <>
                  <NavLink to="/register" className="onyx-nav-link">
                    Register
                  </NavLink>
                  <NavLink to="/login" className="onyx-nav-link">
                    Sign In
                  </NavLink>
                </>
              )}

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
                    to="/getyourcart"
                    className="onyx-nav-link relative flex items-center gap-1.5"
                    aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                  >
                    <CartIcon />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c49a52] text-[#06060a] text-[9px] font-bold flex items-center justify-center leading-none">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </NavLink>

                  <button
                    onClick={async () => {
                      await handleLogout();
                      navigate("/");
                    }}
                    className="onyx-nav-link bg-transparent border-none cursor-pointer p-0"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* ── Page Content ── */}
      <div className="onyx-container">{children}</div>
    </div>
  );
};

export default Layout;
