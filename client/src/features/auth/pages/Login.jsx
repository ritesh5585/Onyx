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
              {loading ? <span className="inline-block w-4 h-4 border-[1.5px] border-black/20 border-t-black rounded-full animate-[spin_0.7s_linear_infinite]" /> : "Continue"}
            </span>
            {!loading && <span className="text-[1.1rem] leading-none">→</span>}
          </button>

          <GoogleButton />
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#eee9e1] font-semibold no-underline border-b border-[#eee9e1]/20 pb-[1px] transition-colors hover:text-[#c49a52] hover:border-[#c49a52]">
            Register Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
