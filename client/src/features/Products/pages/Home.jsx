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

  console.log(allProduct);

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
            <h1 className="onyx-page-title text-3xl md:text-4xl">Explore and choose.</h1>
            <div className="onyx-divider mt-2" />
          </div>
        </div>

        {/* ── Product Grid ── */}
        {allProduct && allProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16 pb-20 md:pb-24">
            {allProduct.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "X"; // Fallback to our warm editorial

              return (
                <div
                  onClick={() => navigate(`/seller/product/${product._id}`)}
                  key={product._id}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div
                    className="aspect-[4/5] overflow-hidden mb-4 sm:mb-6 rounded-sm relative"
                    style={{ backgroundColor: "#f5f3f0" }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-2">
                    <h3
                      className="text-lg sm:text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-1 sm:mt-2">
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
