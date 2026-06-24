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
          <h1 className="onyx-page-title">Your Products</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pb-20 md:pb-24">
          {sellerProducts.map((product) => {
            const imageUrl =
              product.images?.length > 0 ? product.images[0].url : null;

            return (
              <div
                key={product._id}
                onClick={() =>
                  navigate(`/seller/dashboard/${product._id}/variant`)
                }
                className="group cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[4/5] bg-[#f5f3f0] rounded-sm overflow-hidden mb-4 sm:mb-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#999]">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg sm:text-xl leading-snug transition-colors duration-300 group-hover:text-[#c49a52] line-clamp-2 font-['Cormorant_Garamond',serif]">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed text-[#a09d98]">
                    {product.description}
                  </p>
                  <span className="mt-1 text-[11px] uppercase tracking-[0.2em] font-medium text-[#eee9e1]">
                    {product.price?.currency || "INR"}{" "}
                    {product.price?.amount?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center flex flex-col items-center gap-3 px-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a09d98]">
            Empty Vault
          </span>
          <p className="max-w-md text-base md:text-lg leading-relaxed font-['Cormorant_Garamond',serif]">
            You haven't added any curated pieces yet. Begin by creating a new
            listing.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
