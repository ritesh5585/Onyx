import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  Truck,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Star,
} from "lucide-react";
import Layout from "../../Shared/Layout";
import OrderTimeline from "../components/OrderTimeline";
import { useOrder } from "../hooks/useOrder";
import { toast } from "sonner";

const STATUS_DESCRIPTIONS = {
  placed: "Your order has been placed securely. Our atelier has received the acquisition request.",
  processing: "Our team is curating, inspecting, and carefully packaging your garments in archival gift wrap.",
  shipped: "Your parcel is on route with our insured luxury courier partner.",
  out_for_delivery: "Your parcel is out for final delivery today with the designated courier.",
  delivered: "Your package has arrived. We hope your new acquisition elevates your collection.",
  cancelled: "This acquisition has been cancelled.",
};

const DEV_STATUSES = [
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, handleUpdateStatus } = useOrder();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    setLoading(true);

    fetchOrderById(orderId)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Order fetch error:", err);
          setError(err.response?.data?.message || "Order not found or inaccessible.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, fetchOrderById]);

  const handleCopyId = () => {
    if (!order?._id) return;
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    if (!order?._id || order.status === newStatus || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const updated = await handleUpdateStatus(order._id, newStatus);
      setOrder(updated);
      toast.success(`Order status updated to: ${newStatus.replace("_", " ")}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout showBackButton={true}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full border border-onyx-gold/40 border-t-onyx-gold animate-spin mb-6" />
          <p className="onyx-eyebrow mb-2">Verifying Confirmation</p>
          <h2 className="font-serif text-2xl text-onyx-text font-light">Loading your order details...</h2>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout showBackButton={true}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-center mb-6 text-2xl">
            ✕
          </div>
          <p className="onyx-eyebrow mb-2 text-red-400">Order Lookup Notice</p>
          <h2 className="font-serif text-3xl text-onyx-text mb-4">Unable to display order</h2>
          <p className="text-onyx-muted text-sm max-w-md mb-8">
            {error || "We could not find the requested order in your account archive."}
          </p>
          <div className="flex gap-4">
            <Link to="/my-orders" className="onyx-btn-primary !w-auto px-8">
              View Order History
            </Link>
            <Link to="/" className="onyx-btn-secondary !w-auto px-8">
              Return Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout showBackButton={true}>
      <div className="onyx-container py-10 sm:py-16 max-w-5xl mx-auto">
        {/* ── Celebration Hero ── */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-onyx-gold/40 bg-onyx-gold/10 text-onyx-gold mb-6 shadow-[0_0_30px_rgba(196,154,82,0.25)] animate-pulse">
            <CheckCircle2 size={44} className="stroke-[1.5]" />
          </div>

          <p className="onyx-eyebrow mb-3 tracking-[0.25em] text-onyx-gold">
            Acquisition Confirmed
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-onyx-text mb-4 tracking-tight">
            Thank you for choosing <span className="text-onyx-gold italic">Onyx</span>.
          </h1>
          <p className="text-sm sm:text-base text-onyx-muted max-w-lg mx-auto leading-relaxed">
            Your acquisition has been registered and is being prepared with white-glove archival standards.
          </p>
        </div>

        {/* ── Order Reference & Quick Meta ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl border border-onyx-border/80 bg-onyx-surface/80 backdrop-blur-sm mb-10">
          <div>
            <span className="onyx-eyebrow !text-[9px] block mb-1">Order Identifier</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs sm:text-sm text-onyx-text truncate font-semibold">
                #{order._id.slice(-8).toUpperCase()}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-onyx-muted hover:text-onyx-gold transition-colors p-1"
                title="Copy full order ID"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <div>
            <span className="onyx-eyebrow !text-[9px] block mb-1">Date Confirmed</span>
            <span className="text-xs sm:text-sm text-onyx-text font-medium flex items-center gap-1.5">
              <Calendar size={13} className="text-onyx-gold shrink-0" />
              {formattedDate}
            </span>
          </div>

          <div>
            <span className="onyx-eyebrow !text-[9px] block mb-1">Settlement</span>
            <span className="text-xs sm:text-sm text-onyx-text font-medium flex items-center gap-1.5">
              <CreditCard size={13} className="text-onyx-gold shrink-0" />
              {order.paymentMethod || "Razorpay (Paid)"}
            </span>
          </div>

          <div>
            <span className="onyx-eyebrow !text-[9px] block mb-1">Total Paid</span>
            <span className="text-sm sm:text-base font-semibold text-onyx-gold">
              ₹{Number(order.totalAmount || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Interactive Live Tracking Timeline ── */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl border border-onyx-border/80 bg-onyx-card shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-onyx-border/60">
            <div>
              <p className="onyx-eyebrow !mb-1">Real-Time Dispatch Tracking</p>
              <h3 className="font-serif text-xl sm:text-2xl text-onyx-text font-light">
                Order Status:{" "}
                <span className="text-onyx-gold capitalize">
                  {order.status?.replace("_", " ")}
                </span>
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-onyx-gold/30 bg-onyx-gold/10 text-onyx-gold text-xs">
              <span className="w-2 h-2 rounded-full bg-onyx-gold animate-ping" />
              <span>Live Updates</span>
            </div>
          </div>

          <OrderTimeline
            currentStatus={order.status}
            trackingEvents={order.trackingEvents || []}
          />

          <div className="mt-6 p-4 rounded-xl border border-white/5 bg-onyx-black/60 flex items-start gap-3">
            <ShieldCheck size={20} className="text-onyx-gold shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-onyx-muted leading-relaxed">
              {STATUS_DESCRIPTIONS[order.status] ||
                "Your package is being handled with utmost precision."}
            </p>
          </div>

          {/* ── Development Interactive Status Tester ── */}
          <div className="mt-6 pt-5 border-t border-dashed border-onyx-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-onyx-gold font-semibold">
                  ⚡ Dev Testing Simulator:
                </span>
                <p className="text-[11px] text-onyx-muted/80">
                  Switch the order status to test live timeline animations and tracking states in real time:
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {DEV_STATUSES.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(s.key)}
                    className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-md transition-all ${
                      order.status === s.key
                        ? "bg-onyx-gold text-black font-bold shadow-[0_0_8px_rgba(196,154,82,0.4)]"
                        : "border border-white/10 bg-white/5 text-onyx-muted hover:border-onyx-gold/40 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Ordered Pieces Summary ── */}
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="onyx-eyebrow mb-1">Acquisition Details</p>
              <h2 className="font-serif text-2xl text-onyx-text font-light">
                Selected Pieces ({order.items?.length || 0})
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {order.items?.map((item, idx) => {
              const productId = item.product?._id || item.product || item.productId;
              return (
                <div
                  key={item._id || idx}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-onyx-border/70 bg-onyx-surface hover:border-onyx-gold/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-black/40 border border-white/5 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-onyx-muted text-[10px]">
                          Piece
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif text-base sm:text-lg text-onyx-text group-hover:text-onyx-gold transition-colors">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-[11px] uppercase tracking-wider text-onyx-muted mt-0.5">
                          Variant: {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-onyx-muted mt-1">
                        Quantity: <span className="text-onyx-text font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 gap-2">
                    <span className="font-sans text-sm sm:text-base font-semibold text-onyx-gold">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </span>

                    {productId && (
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/product/${productId}`}
                          className="inline-flex items-center gap-1 text-[11px] text-onyx-muted hover:text-onyx-gold transition-colors"
                        >
                          View Piece <ExternalLink size={11} />
                        </Link>
                        <Link
                          to={`/product/${productId}#reviews`}
                          className="inline-flex items-center gap-1 text-[11px] text-onyx-gold hover:underline"
                        >
                          <Star size={11} className="fill-onyx-gold" /> Write Review
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Delivery & Financial Breakdown ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Shipping Address */}
          <div className="p-6 rounded-2xl border border-onyx-border/70 bg-onyx-surface flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck size={18} className="text-onyx-gold" />
                <h3 className="font-serif text-lg text-onyx-text font-light">
                  Delivery Destination
                </h3>
              </div>
              <p className="font-semibold text-onyx-text text-sm mb-1">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs sm:text-sm text-onyx-muted leading-relaxed">
                {order.shippingAddress?.addressLine1}
                {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                <br />
                {order.shippingAddress?.country || "India"}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-onyx-muted">
              <span>Courier Service:</span>
              <span className="text-onyx-text font-medium">Onyx Express Luxury White-Glove</span>
            </div>
          </div>

          {/* Pricing & Receipt Breakdown */}
          <div className="p-6 rounded-2xl border border-onyx-border/70 bg-onyx-surface">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} className="text-onyx-gold" />
              <h3 className="font-serif text-lg text-onyx-text font-light">
                Acquisition Summary
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-onyx-muted">
                <span>Items Subtotal</span>
                <span className="text-onyx-text font-medium">
                  ₹{Number(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-onyx-muted">
                <span>Archival Packaging & Box</span>
                <span className="text-emerald-400 font-medium">Complimentary</span>
              </div>
              <div className="flex justify-between text-onyx-muted">
                <span>Insured White-Glove Delivery</span>
                <span className="text-emerald-400 font-medium">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm sm:text-base">
                <span className="font-serif text-onyx-text">Total Settled</span>
                <span className="font-sans font-semibold text-onyx-gold text-lg">
                  ₹{Number(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-onyx-muted/70 text-center">
              Official Tax Invoice & Warranty documentation included in parcel.
            </div>
          </div>
        </div>

        {/* ── Actions Footer ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-onyx-border/80 bg-onyx-card">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-onyx-muted hover:text-onyx-gold transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Official Receipt</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              to="/my-orders"
              className="onyx-btn-secondary !w-full sm:!w-auto px-6 py-3 text-xs"
            >
              View Order History
            </Link>
            <Link
              to="/"
              className="onyx-btn-primary !w-full sm:!w-auto px-8 py-3 text-xs inline-flex items-center justify-center gap-2"
            >
              <span>Continue Exploring</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
