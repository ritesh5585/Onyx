import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import AuthLayout from "../components/AuthLayout";
import { IcoMail, IcoLock, IcoClose } from "../components/AuthIcons";
import { GoogleButton } from "../components/GoogleButton";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    // Clear field-specific errors when user types
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await handleLogin({
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      // Case 1: Wrong password (401 Unauthorized)
      if (status === 401) {
        setError("❌ Incorrect password. Please try again.");
        setFieldErrors({ password: "Wrong password" });
      }
      // Case 2: User not found (404)
      else if (status === 404) {
        setError("❌ Account not found with this email.");
        setFieldErrors({ email: "Email not registered" });
      }
      // Case 3: Validation errors from backend
      else if (data?.errors?.length) {
        const firstError = data.errors[0];
        if (firstError.param === "email") {
          setFieldErrors({ email: firstError.msg });
        } else if (firstError.param === "password") {
          setFieldErrors({ password: firstError.msg });
        }
        setError(`❌ ${firstError.msg}`);
      }
      // Case 4: Rate limiting or too many attempts
      else if (status === 429) {
        setError("⏳ Too many attempts. Please wait a moment.");
      }
      // Case 5: Server error
      else if (status >= 500) {
        setError("⚠️ Server error. Please try again later.");
      }
      // Case 6: Network error
      else if (err.code === "ERR_NETWORK") {
        setError("🌐 Network error. Please check your connection.");
      }
      // Case 7: Generic error
      else {
        setError(
          data?.message || "Login failed. Please check your credentials.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout headline="Dress for" sub="the moment." eyebrow="Collections">
      <button
        className="absolute top-6 right-7 w-9 h-9 rounded-full border border-white/10 bg-transparent text-[#eee9e1]/45 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white/15 hover:text-[#eee9e1] hover:bg-[#13131a]"
        onClick={() => navigate("/")}
        aria-label="Close"
      >
        <IcoClose />
      </button>

      <div className="max-w-[360px] w-full mx-auto">
        <p className="auth-panel__eyebrow">Existing Member</p>
        <h2 className="auth-panel__title">Welcome Back!</h2>

        <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
          {/* General Error */}
          {error && (
            <div
              className="auth-error p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2"
              role="alert"
            >
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="l-email">
              Email
            </label>
            <div
              className={`auth-input-wrap ${fieldErrors.email ? "border-red-500/50" : ""}`}
            >
              <span className="auth-input-icon">
                <IcoMail />
              </span>
              <input
                id="l-email"
                className={`auth-input ${fieldErrors.email ? "text-red-400" : ""}`}
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <span>❌</span> {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="auth-field">
            <div className="flex items-center justify-between">
              <label className="auth-label" htmlFor="l-pass">
                Password
              </label>
              <a
                href="#"
                className="text-[0.68rem] text-[#eee9e1]/22 no-underline transition-colors hover:text-[#c49a52]"
                onClick={(e) => e.preventDefault()}
              >
                Forgot?
              </a>
            </div>
            <div
              className={`auth-input-wrap ${fieldErrors.password ? "border-red-500/50" : ""}`}
            >
              <span className="auth-input-icon">
                <IcoLock />
              </span>
              <input
                id="l-pass"
                className={`auth-input ${fieldErrors.password ? "text-red-400" : ""}`}
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <span>❌</span> {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            <span>
              {loading ? (
                <span className="inline-block w-4 h-4 border-[1.5px] border-black/20 border-t-black rounded-full animate-[spin_0.7s_linear_infinite]" />
              ) : (
                "Continue"
              )}
            </span>
            {!loading && <span className="text-[1.1rem] leading-none">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#eee9e1] font-semibold no-underline border-b border-[#eee9e1]/20 pb-[1px] transition-colors hover:text-[#c49a52] hover:border-[#c49a52]"
          >
            Register Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
