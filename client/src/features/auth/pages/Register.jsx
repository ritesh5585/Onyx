import React, { useState } from "react";
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
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const onChange = ({ target: { name, value, type, checked } }) =>
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please check your inputs.",
      );
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
        <p className="text-[0.6rem] font-semibold tracking-[0.24em] uppercase text-[#c49a52] mb-2">Create Account</p>
        <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] font-normal text-[#eee9e1] leading-[1.2] tracking-[-0.01em] mb-5">Join Onyx</h2>

        <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
          {error && (
            <p className="bg-red-500/10 border border-red-500/20 rounded-[10px] p-3 text-[0.8rem] text-red-400 mb-[18px] leading-[1.6] flex items-start gap-2 before:content-['✕'] before:shrink-0 before:mt-[1px] before:opacity-70" role="alert">
              {error}
            </p>
          )}

          <div className="flex max-[480px]:flex-col min-[481px]:flex-row gap-3 w-full">
            {/* Full Name */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-name">
                Full Name
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <IcoUser />
                </span>
                <input
                  id="r-name"
                  className="auth-input"
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-contact">
                Contact
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <IcoPhone />
                </span>
                <input
                  id="r-contact"
                  className="auth-input"
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
            </div>
          </div>

          <div className="flex max-[480px]:flex-col min-[481px]:flex-row gap-3 w-full">
            {/* Email */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-email">
                Email
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <IcoMail />
                </span>
                <input
                  id="r-email"
                  className="auth-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field flex-1 min-w-0">
              <label className="auth-label" htmlFor="r-pass">
                Password
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <IcoLock />
                </span>
                <input
                  id="r-pass"
                  className="auth-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Strong password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Seller checkbox */}
          <label className="flex items-center gap-[11px] bg-[#13131a] border border-white/10 rounded-[10px] py-[13px] px-[14px] cursor-pointer transition-colors hover:border-white/20" htmlFor="r-seller">
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

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            <span>
              {loading ? <span className="inline-block w-4 h-4 border-[1.5px] border-black/20 border-t-black rounded-full animate-[spin_0.7s_linear_infinite]" /> : "Create Account"}
            </span>
            {!loading && <span className="text-[1.1rem] leading-none">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="mt-6 text-center text-[0.78rem] text-[#eee9e1]/20">
          Already have an account?{" "}
          <Link to="/login" className="text-[#eee9e1] font-semibold no-underline border-b border-[#eee9e1]/20 pb-[1px] transition-colors hover:text-[#c49a52] hover:border-[#c49a52]">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
