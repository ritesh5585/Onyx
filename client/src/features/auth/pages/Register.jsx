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
        className="auth-close"
        onClick={() => navigate("/")}
        aria-label="Close"
      >
        <IcoClose />
      </button>

      <div className="auth-panel__inner">
        <p className="auth-panel__eyebrow">Create Account</p>
        <h2 className="auth-panel__title">Join Onyx</h2>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {/* Full Name */}
          <div className="auth-field">
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

          {/* Email */}
          <div className="auth-field">
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

          {/* Contact */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="r-contact">
              Contact Number
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

          {/* Password */}
          <div className="auth-field">
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
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Seller checkbox */}
          <label className="auth-checkbox-row" htmlFor="r-seller">
            <input
              id="r-seller"
              className="auth-checkbox"
              type="checkbox"
              name="isSeller"
              checked={form.isSeller}
              onChange={onChange}
            />
            <span className="auth-checkbox-label">
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
              {loading ? <span className="auth-spinner" /> : "Create Account"}
            </span>
            {!loading && <span className="auth-btn__arrow">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-footer__link">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
