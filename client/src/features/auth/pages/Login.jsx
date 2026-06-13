import React, {useState} from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setLoading(true);

    try {
      await handleLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.msg ||
          "Registration failed. Please check your inputs and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Sign in to your account to continue
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition bg-zinc-50/20"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-zinc-400 hover:text-zinc-900 transition"
                onClick={(e) => e.preventDefault()}
              >
                Forgot?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition bg-zinc-50/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition shadow-sm"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
