import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import AuthLayout from "../components/AuthLayout";
import {
  IcoUser,
  IcoMail,
  IcoPhone,
  IcoLock,
  IcoClose,
} from "../components/AuthIcons";
import { GoogleButton } from "../components/GoogleButton";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const onChange = ({ target: { name, value, type, checked } }) => {
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    // Clear field-specific errors when user types
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
    if (error) setError("");
  };

  // ============================================
  // CLIENT-SIDE VALIDATION
  // ============================================

  const validateForm = () => {
    const errors = {};

    // Full Name validation
    if (!form.fullname.trim()) {
      errors.fullname = "Full name is required";
    } else if (form.fullname.trim().length < 2) {
      errors.fullname = "Name must be at least 2 characters";
    } else if (form.fullname.trim().length > 50) {
      errors.fullname = "Name must be less than 50 characters";
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Contact validation
    if (!form.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(form.contact.trim())) {
      errors.contact = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (form.password.length > 30) {
      errors.password = "Password must be less than 30 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) {
      errors.password = "Password must contain both letters and numbers";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Client-side validation first
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await handleRegister({
        fullname: form.fullname.trim(),
        contact: form.contact.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        isSeller: form.isSeller,
      });
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      // Case 1: Email already exists (409 Conflict)
      if (status === 409) {
        setError(
          "❌ This email is already registered. Please use a different email.",
        );
        setFieldErrors({ email: "Email already exists" });
      }
      // Case 2: Validation errors from backend
      else if (data?.errors?.length) {
        const errorsMap = {};
        data.errors.forEach((err) => {
          if (err.param === "email") {
            errorsMap.email = err.msg;
          } else if (err.param === "password") {
            errorsMap.password = err.msg;
          } else if (err.param === "fullname") {
            errorsMap.fullname = err.msg;
          } else if (err.param === "contact") {
            errorsMap.contact = err.msg;
          }
        });
        setFieldErrors(errorsMap);
        setError(`❌ ${data.errors[0]?.msg || "Please check your inputs."}`);
      }
      // Case 3: Rate limiting
      else if (status === 429) {
        setError("⏳ Too many attempts. Please wait a moment.");
      }
      // Case 4: Server error
      else if (status >= 500) {
        setError("⚠️ Server error. Please try again later.");
      }
      // Case 5: Network error
      else if (err.code === "ERR_NETWORK") {
        setError("🌐 Network error. Please check your connection.");
      }
      // Case 6: Generic error
      else {
        setError(
          data?.message || "Registration failed. Please check your inputs.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout headline="Your style," sub="your story." eyebrow="New Member">
      <button
        className="absolute top-6 right-7 w-9 h-9 rounded-full border border-white/10 bg-transparent text-[#eee9e1]/45 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white/15 hover:text-[#eee9e1] hover:bg-[#13131a]"
        onClick={() => navigate("/")}
        aria-label="Close"
      >
        <IcoClose />
      </button>

      <div className="max-w-[360px] w-full mx-auto">
        <p className="text-[0.6rem] font-semibold tracking-[0.24em] uppercase text-[#c49a52] mb-2">
          Create Account
        </p>
        <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] font-normal text-[#eee9e1] leading-[1.2] tracking-[-0.01em] mb-5">
          Join Onyx
        </h2>

        <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
          {/* General Error */}
          {error && (
            <div
              className="bg-red-500/10 border border-red-500/20 rounded-[10px] p-3 text-[0.8rem] text-red-400 mb-[18px] leading-[1.6] flex items-start gap-2"
              role="alert"
            >
              <span className="shrink-0 mt-[1px]">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ============================================ */}
          {/* FULL NAME & CONTACT - Row 1 */}
          {/* ============================================ */}

          <div className="flex max-[480px]:flex-col min-[481px]:flex-row gap-3 w-full">
            {/* Full Name */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-name">
                Full Name
              </label>
              <div
                className={`auth-input-wrap ${fieldErrors.fullname ? "border-red-500/50" : ""}`}
              >
                <span className="auth-input-icon">
                  <IcoUser />
                </span>
                <input
                  id="r-name"
                  className={`auth-input ${fieldErrors.fullname ? "text-red-400" : ""}`}
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>
              {fieldErrors.fullname && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>❌</span> {fieldErrors.fullname}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-contact">
                Contact
              </label>
              <div
                className={`auth-input-wrap ${fieldErrors.contact ? "border-red-500/50" : ""}`}
              >
                <span className="auth-input-icon">
                  <IcoPhone />
                </span>
                <input
                  id="r-contact"
                  className={`auth-input ${fieldErrors.contact ? "text-red-400" : ""}`}
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={onChange}
                  placeholder="99999 99999"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                />
              </div>
              {fieldErrors.contact && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>❌</span> {fieldErrors.contact}
                </p>
              )}
            </div>
          </div>

          <div className="flex max-[480px]:flex-col min-[481px]:flex-row gap-3 w-full">
            {/* Email */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-email">
                Email
              </label>
              <div
                className={`auth-input-wrap ${fieldErrors.email ? "border-red-500/50" : ""}`}
              >
                <span className="auth-input-icon">
                  <IcoMail />
                </span>
                <input
                  id="r-email"
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

            {/* Password */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-pass">
                Password
              </label>
              <div
                className={`auth-input-wrap ${fieldErrors.password ? "border-red-500/50" : ""}`}
              >
                <span className="auth-input-icon">
                  <IcoLock />
                </span>
                <input
                  id="r-pass"
                  className={`auth-input ${fieldErrors.password ? "text-red-400" : ""}`}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Strong password"
                  autoComplete="new-password"
                  required
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>❌</span> {fieldErrors.password}
                </p>
              )}
              {/* Password strength indicator */}
              {form.password && !fieldErrors.password && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <span>✅</span> Password looks good!
                </p>
              )}
            </div>
          </div>

          {/* Seller Checkbox */}
          <label
            className={`flex items-center gap-[11px] bg-[#13131a] border rounded-[10px] py-[13px] px-[14px] cursor-pointer transition-colors ${
              fieldErrors.isSeller
                ? "border-red-500/50"
                : "border-white/10 hover:border-white/20"
            }`}
            htmlFor="r-seller"
          >
            <input
              id="r-seller"
              className="auth-checkbox"
              type="checkbox"
              name="isSeller"
              checked={form.isSeller}
              onChange={onChange}
            />
            <span className="text-[0.82rem] text-[#eee9e1]/45 cursor-pointer select-none">
              Register as a Seller / Merchant
            </span>
          </label>

          {/* Submit Button */}
          <button
            id="register-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            <span>
              {loading ? (
                <span className="inline-block w-4 h-4 border-[1.5px] border-black/20 border-t-black rounded-full animate-[spin_0.7s_linear_infinite]" />
              ) : (
                "Create Account"
              )}
            </span>
            {!loading && <span className="text-[1.1rem] leading-none">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="mt-6 text-center text-[0.78rem] text-[#eee9e1]/20">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#eee9e1] font-semibold no-underline border-b border-[#eee9e1]/20 pb-[1px] transition-colors hover:text-[#c49a52] hover:border-[#c49a52]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
