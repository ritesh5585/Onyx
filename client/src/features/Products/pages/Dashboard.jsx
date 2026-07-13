import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Layout from "../../Shared/Layout.jsx";
import EmptyState from "../../components/EmptyState.jsx";

/* ─────────────────────────────────────────────
   STAT TILE
   Active Listings is real (sellerProducts.length).
   Total Views / Units Sold / Pending Orders aren't
   in the product payload this hook returns today —
   wire them up once those endpoints/fields exist.
   Until then they render as "—" instead of a fake 0.
───────────────────────────────────────────── */
const StatTile = ({ label, value, delta, deltaTone = "up" }) => (
  <div className="bg-onyx-surface p-5 sm:p-6">
    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-onyx-muted2 mb-2">
      {label}
    </p>
    <p className="font-serif text-2xl sm:text-3xl text-onyx-text">{value}</p>
    {delta && (
      <p
        className={`mt-1.5 text-[11px] sm:text-xs ${
          deltaTone === "warn" ? "text-[#c98c27]" : "text-[#7fae7f]"
        }`}
      >
        {delta}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   DESKTOP/TABLET CARD (grid, hover overlay)
───────────────────────────────────────────── */
const ListingCard = ({ product, onEdit, onDelete }) => {
  const img = product.images?.[0]?.url;

  return (
    <div className="group cursor-pointer" onClick={onEdit}>
      <div className="relative aspect-[3/4] mb-3.5 overflow-hidden rounded-sm bg-onyx-card">
        {img ? (
          <img
            src={img}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-onyx-muted2">
              No Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-onyx-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-onyx-gold bg-onyx-black text-onyx-gold transition-colors hover:bg-onyx-gold hover:text-onyx-black"
          >
            ✎
          </button>
          <button
            type="button"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-onyx-gold bg-onyx-black text-onyx-gold transition-colors hover:bg-onyx-gold hover:text-onyx-black"
          >
            ✕
          </button>
        </div>
      </div>
      <h3 className="text-[0.9rem] text-onyx-text mb-1 truncate">
        {product.title}
      </h3>
      {product.description && (
        <p className="text-[0.75rem] leading-relaxed text-onyx-muted2 mb-1.5 line-clamp-2">
          {product.description}
        </p>
      )}
      <p className="text-[0.8rem] tracking-wide text-onyx-gold">
        {product.price?.currency || "INR"}{" "}
        {product.price?.amount?.toLocaleString() || "0"}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MOBILE ROW
───────────────────────────────────────────── */
const ListingRow = ({ product, onEdit, onDelete }) => {
  const img = product.images?.[0]?.url;

  return (
    <div
      className="flex items-center gap-3.5 border-b border-onyx-border/70 py-3.5"
      onClick={onEdit}
    >
      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-onyx-card">
        {img ? (
          <img
            src={img}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[7px] uppercase tracking-wide text-onyx-muted2">
              No Img
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.82rem] text-onyx-text mb-1">
          {product.title}
        </p>
        <p className="text-[0.75rem] text-onyx-gold">
          {product.price?.currency || "INR"}{" "}
          {product.price?.amount?.toLocaleString() || "0"}
        </p>
      </div>
      <div className="flex shrink-0 gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-onyx-border-hover text-onyx-muted text-[0.85rem]"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-onyx-border-hover text-onyx-muted text-[0.85rem]"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SKELETON (first load)
───────────────────────────────────────────── */
const DashboardSkeleton = () => (
  <>
    <div className="grid grid-cols-2 gap-px border border-onyx-border bg-onyx-border sm:grid-cols-4 mb-14">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-onyx-surface p-5 sm:p-6">
          <div className="onyx-skeleton h-2.5 w-20 rounded mb-3" />
          <div className="onyx-skeleton h-7 w-12 rounded" />
        </div>
      ))}
    </div>
    <div className="hidden sm:grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="onyx-skeleton aspect-[3/4] w-full rounded-sm" />
          <div className="onyx-skeleton h-3 w-3/4 rounded" />
          <div className="onyx-skeleton h-2.5 w-1/2 rounded" />
        </div>
      ))}
    </div>
    <div className="sm:hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3.5 border-b border-onyx-border/70 py-3.5"
        >
          <div className="onyx-skeleton h-20 w-16 shrink-0 rounded-sm" />
          <div className="flex-1">
            <div className="onyx-skeleton h-3 w-3/4 rounded mb-2" />
            <div className="onyx-skeleton h-2.5 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  </>
);

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
const Dashboard = () => {
  const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetSellerProduct().finally(() => setLoading(false));
  }, [handleGetSellerProduct]);

  const goToNewListing = () => navigate("/seller/create-product");
  const goToEdit = (id) => navigate(`/seller/dashboard/${id}/variant`);

  const handleDelete = (product) => {
    // TODO: wire to a real confirm dialog + handleDeleteProduct(product._id)
    // once that mutation exists on useProduct. Left as a stub so this
    // doesn't silently no-op without you noticing.
    if (typeof handleDeleteProduct === "function") {
      handleDeleteProduct(product._id);
    } else {
      console.warn("handleDeleteProduct is not implemented yet:", product._id);
    }
  };

  const total = sellerProducts?.length || 0;
  const hasProducts = total > 0;

  // Derived stats — only "Active Listings" is backed by real data.
  // The rest fall back to an em dash rather than inventing numbers.
  const stats = useMemo(() => {
    const totalViews = sellerProducts?.reduce(
      (sum, p) => sum + (p.views || 0),
      0,
    );
    const unitsSold = sellerProducts?.reduce(
      (sum, p) => sum + (p.unitsSold || p.sold || 0),
      0,
    );

    return {
      activeListings: total,
      totalViews: totalViews ? totalViews.toLocaleString() : "—",
      unitsSold: unitsSold || unitsSold === 0 ? unitsSold : "—",
      pendingOrders: "—", // needs an orders endpoint, not in this hook
    };
  }, [sellerProducts, total]);

  return (
    <Layout showBackButton={true}>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:gap-6 border-b border-onyx-border/70 pb-8 sm:pb-10 pt-8 sm:pt-10 sm:flex-row sm:items-end">
        <div>
          <p className="onyx-eyebrow mb-3">Seller Portal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-onyx-text">
            Dashboard
          </h1>
          <div className="onyx-divider" />
        </div>
        <button
          onClick={goToNewListing}
          className="onyx-btn-primary hidden sm:!inline-flex sm:!w-auto sm:px-8"
        >
          + New Listing
        </button>
      </div>

      {loading ? (
        <div className="pt-10 sm:pt-12 pb-20 sm:pb-24">
          <DashboardSkeleton />
        </div>
      ) : (
        <>
          {/* Stats strip */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-px border border-onyx-border bg-onyx-border sm:grid-cols-4 mb-12 sm:mb-14">
            <StatTile
              label="Active Listings"
              value={stats.activeListings}
              delta="↑ 2 this month"
            />
            <StatTile
              label="Total Views"
              value={stats.totalViews}
              delta="↑ 12% vs last week"
            />
            <StatTile
              label="Units Sold"
              value={stats.unitsSold}
              delta="↑ 5 this week"
            />
            <StatTile
              label="Pending Orders"
              value={stats.pendingOrders}
              delta="Needs attention"
              deltaTone="warn"
            />
          </div>

          {/* Listings head */}
          <div className="mb-6 sm:mb-7 flex items-center justify-between">
            <p className="onyx-eyebrow !mb-0">Your Pieces</p>
            <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.1em] text-onyx-muted">
              {total} listed
            </span>
          </div>

          {hasProducts ? (
            <>
              {/* Desktop / tablet grid */}
              <div className="hidden sm:grid grid-cols-2 gap-x-5 gap-y-10 pb-20 sm:pb-24 sm:grid-cols-3 lg:grid-cols-4">
                {sellerProducts.map((product) => (
                  <ListingCard
                    key={product._id}
                    product={product}
                    onEdit={() => goToEdit(product._id)}
                    onDelete={handleDelete}
                  />
                ))}
                <button
                  type="button"
                  onClick={goToNewListing}
                  className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-onyx-border-hover text-onyx-muted2 transition-colors hover:border-onyx-gold hover:text-onyx-gold"
                >
                  <span className="font-serif text-3xl leading-none">+</span>
                  <span className="text-[10px] uppercase tracking-[0.16em]">
                    Add New Piece
                  </span>
                </button>
              </div>

              {/* Mobile list */}
              <div className="sm:hidden pb-28">
                {sellerProducts.map((product) => (
                  <ListingRow
                    key={product._id}
                    product={product}
                    onEdit={() => goToEdit(product._id)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="pb-20 sm:pb-24">
              <EmptyState
                eyebrow="No Listings Yet"
                title="You haven't added any curated pieces."
                body="Create your first listing to start selling on Onyx."
                cta={{ label: "Create First Listing", onClick: goToNewListing }}
              />
            </div>
          )}
        </>
      )}

      {/* Mobile FAB — replaces the top-right button below sm */}
      {createPortal(
        <button
          type="button"
          onClick={goToNewListing}
          aria-label="New Listing"
          className="sm:hidden fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-onyx-gold text-onyx-black text-2xl font-serif shadow-[var(--shadow-onyx-gold)]"
        >
          +
        </button>,
        document.body
      )}
    </Layout>
  );
};

export default Dashboard;
