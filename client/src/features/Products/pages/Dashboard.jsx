import React, { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Layout from "../../Shared/Layout.jsx";
import ProductCard from "../../Shared/ProductCard.jsx";
import EmptyState from "../../Shared/EmptyState.jsx";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProduct();
  }, [handleGetSellerProduct]);

  return (
    <Layout showBackButton={true}>
      {/* ── Page Header ── */}
      <div className="pt-10 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <p className="onyx-eyebrow mb-3">Seller Portal</p>
          <h1 className="onyx-page-title">Your Listings</h1>
          <div className="onyx-divider" />
          {sellerProducts && sellerProducts.length > 0 && (
            <span className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-[rgba(238,233,225,0.4)]">
              {sellerProducts.length} {sellerProducts.length === 1 ? "piece" : "pieces"}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/seller/create-product")}
          className="onyx-btn-primary sm:!w-auto sm:px-8"
        >
          + New Listing
        </button>
      </div>

      {/* ── Product Grid ── */}
      {sellerProducts && sellerProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 pt-12 pb-24">
          {sellerProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => navigate(`/seller/dashboard/${product._id}/variant`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="No Listings Yet"
          title="You haven't added any curated pieces."
          body="Create your first listing to start selling on Onyx."
          cta={{ label: "Create First Listing", onClick: () => navigate("/seller/create-product") }}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
