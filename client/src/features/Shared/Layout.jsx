import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/hook/useAuth";

const Layout = ({ children, showLinks = false, showBackButton = false }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  return (
    <div className="onyx-bg min-h-screen">
      <div className="onyx-container">
        {/* ── Top Bar ── */}
        <div
          className={`onyx-navbar ${
            showLinks ? "onyx-navbar-with-links" : "onyx-navbar-no-links"
          }`}
        >
          {showLinks ? (
            <span className="onyx-nav-title">ONYX.</span>
          ) : (
            <>
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="onyx-nav-back"
                  type="button"
                  aria-label="Go back"
                >
                  ←
                </button>
              )}
              <span className="onyx-nav-title">ONYX.</span>
            </>
          )}

          {showLinks && (
            <div className="onyx-nav-menu">
              {!user && (
                <>
                  <NavLink to={"/register"} className="onyx-nav-link">
                    Register
                  </NavLink>
                  <NavLink to={"/login"} className="onyx-nav-link">
                    Login
                  </NavLink>
                </>
              )}
              {user?.role === "seller" && (
                <>
                  <NavLink
                    to={"/seller/create-product"}
                    className="onyx-nav-link"
                  >
                    Upload
                  </NavLink>
                  <NavLink to={"/seller/dashboard"} className="onyx-nav-link">
                    Dashboard
                  </NavLink>
                </>
              )}
              {user && (
                <button
                  onClick={async () => {
                    await handleLogout();
                    navigate("/");
                  }}
                  className="onyx-nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Page Content ── */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
