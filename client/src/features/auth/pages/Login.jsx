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
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await handleLogin({ email: form.email.trim(), password: form.password });
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout headline="Dress for" sub="the moment." eyebrow="Collections">
      <button
        className="auth-close"
        onClick={() => navigate("/")}
        aria-label="Close"
      >
        <IcoClose />
      </button>

      <div className="auth-panel__inner">
        <p className="auth-panel__eyebrow">Existing Member</p>
        <h2 className="auth-panel__title">Welcome Back!</h2>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="l-email">
              Email
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IcoMail />
              </span>
              <input
                id="l-email"
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
          <div className="auth-field">
            <div className="auth-field__row">
              <label className="auth-label" htmlFor="l-pass">
                Password
              </label>
              <a
                href="#"
                className="auth-forgot"
                onClick={(e) => e.preventDefault()}
              >
                Forgot?
              </a>
            </div>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <IcoLock />
              </span>
              <input
                id="l-pass"
                className="auth-input"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            <span>
              {loading ? <span className="auth-spinner" /> : "Continue"}
            </span>
            {!loading && <span className="auth-btn__arrow">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-footer__link">
            Register Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
