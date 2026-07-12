import React from "react";
import { useNavigate } from "react-router";
import Layout from "../Shared/Layout";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
        <p className="onyx-eyebrow mb-4">Error 404</p>
        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-light text-[#eee9e1] mb-6 tracking-tight leading-none"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Page Not <br className="sm:hidden" /> Found.
        </h1>
        <p className="max-w-sm text-[13px] sm:text-[15px] leading-relaxed text-[rgba(238,233,225,0.45)] mb-10">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="onyx-btn-primary !w-auto px-10 py-4"
        >
          Return to Archive
        </button>
      </div>
    </Layout>
  );
};

export default NotFound;
