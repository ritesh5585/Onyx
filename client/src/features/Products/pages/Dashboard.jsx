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
      <div className="flex flex-col justify-between gap-6 border-b border-onyx-border/70 pb-10 pt-10 sm:flex-row sm:items-end">
        <div>
          <p className="onyx-eyebrow mb-3">Seller Portal</p>
          <div className="onyx-divider" />
          {sellerProducts && sellerProducts.length > 0 && (
            <span className="mt-4 block text-[11px] uppercase tracking-[0.16em] text-onyx-muted/70">
              {sellerProducts.length}{" "}
              {sellerProducts.length === 1 ? "piece" : "pieces"}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/seller/create-product")}
          className="onyx-btn-primary sm:w-auto sm:px-8"
        >
          + New Listing
        </button>
      </div>

      {/* ── Product Grid ── */}
      {sellerProducts && sellerProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 pb-24 pt-12 sm:grid-cols-3 lg:grid-cols-4">
          {sellerProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() =>
                navigate(`/seller/dashboard/${product._id}/variant`)
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="No Listings Yet"
          title="You haven't added any curated pieces."
          body="Create your first listing to start selling on Onyx."
          cta={{
            label: "Create First Listing",
            onClick: () => navigate("/seller/create-product"),
          }}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
