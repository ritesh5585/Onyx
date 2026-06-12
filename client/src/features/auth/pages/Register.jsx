import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
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
      await handleRegister({
        fullname: formData.fullname.trim(),
        contact: formData.contact.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        isSeller: formData.isSeller,
      });

      navigate("/");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.msg ||
          "Registration failed. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">
          Create an account
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Register to start buying or selling
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              autoComplete="name"
              required
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition bg-zinc-50/20"
            />
          </div>

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
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="99999 99999"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              autoComplete="tel"
              inputMode="numeric"
              required
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-sm transition bg-zinc-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Password
            </label>
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

          <div className="flex items-center space-x-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
            <input
              id="isSeller"
              name="isSeller"
              type="checkbox"
              checked={formData.isSeller}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-900 accent-zinc-900 cursor-pointer"
            />
            <label
              htmlFor="isSeller"
              className="text-sm text-zinc-700 select-none cursor-pointer"
            >
              Register as a Seller / Merchant
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition shadow-sm"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
