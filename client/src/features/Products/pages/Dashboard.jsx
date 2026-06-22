import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Layout from "../../Shared/Layout.jsx";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);

  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  return (
    <Layout showBackButton={true}>
        {/* ── Page Header ── */}
        <div className="pt-8 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="onyx-page-title">
              Your Products
            </h1>
            <div className="onyx-divider" />
          </div>

          <button
            onClick={() => navigate("/seller/create-product")}
            className="onyx-btn-primary sm:w-40"
          >
            New Listing
          </button>
        </div>

        {/* ── Product Grid ── */}
        {sellerProducts && sellerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16 pb-20 md:pb-24">
            {sellerProducts.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "X"; // Fallback to our warm editorial

              return (
                <div
                  onClick={() => navigate(`/seller/dashboard/${product._id}/variant`)}
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
              You haven't added any curated pieces to your archive yet. Begin by
              creating a new listing.
            </p>
          </div>
        )}
    </Layout>
  );
};

export default Dashboard;
