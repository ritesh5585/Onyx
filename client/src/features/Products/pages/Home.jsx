import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";

const Home = () => {
  const allProduct = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className="onyx-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 xl:px-24">
        {/* ── Top Bar ── */}
        <div className="py-4 md:py-5 flex items-center justify-between border-b border-[#1f1f1f]">
          <span className="onyx-nav-title">ONYX.</span>
          <div className="flex gap-4 text-sm font-medium tracking-wide uppercase">
            <NavLink
              to={"/register"}
              className="hover:text-[#C9A96E] transition-colors"
            >
              Register
            </NavLink>
            <NavLink
              to={"/login"}
              className="hover:text-[#C9A96E] transition-colors"
            >
              Login
            </NavLink>
            <NavLink
              to={"/seller/create-product"}
              className="hover:text-[#C9A96E] transition-colors"
            >
              Upload
            </NavLink>
            <NavLink
              to={"/seller/dashboard"}
              className="hover:text-[#C9A96E] transition-colors"
            >
              Dashboard
            </NavLink>
          </div>
        </div>

        {/* ── Page Header ── */}
        <div className="pt-8 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="onyx-page-title text-3xl md:text-4xl">
              Explore and choose.
            </h1>
            <div className="onyx-divider mt-2" />
          </div>
        </div>

        {/* ── Product Grid ── */}
        {allProduct && allProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-20 md:pb-24">
            {allProduct.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "X";

              return (
                <div
                  onClick={() => navigate(`/product/${product._id}`)}
                  key={product._id}
                  className="group cursor-pointer flex flex-col w-full max-w-[260px]"
                >
                  {/* Image Container */}
                  <div className="w-[220px] h-[300px] bg-[#f5f3f0] rounded-md overflow-hidden flex items-center justify-center mb-4">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-2 min-h-[120px]">
                    <h3
                      className="text-lg sm:text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E] line-clamp-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-2">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium">
                        {product.price?.currency || "INR"}{" "}
                        {product.price?.amount?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 md:py-24 text-center flex flex-col items-center px-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3 md:mb-4">
              Empty Vault
            </span>
            <p
              className="max-w-md mx-auto text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              No items are currently available in the archive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
