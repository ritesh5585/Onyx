import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../hooks/useCart";
import RazorPay from "./RazorPay";
import { toast } from "sonner";

const OrderSummary = ({
  count,
  subtotal,
  shipping,
  total,
  currency,
  selectedAddress = null,
  onPromptAddress,
}) => {
  const { handleOrderPayment } = useCart();

  const [paymentData, setPaymentData] = useState(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (isCheckoutLoading) return;

    if (!selectedAddress) {
      toast.error("Please select or add a delivery address to proceed");
      onPromptAddress?.();
      return;
    }

    try {
      setIsCheckoutLoading(true);
      setPaymentData(null);
      const data = await handleOrderPayment(selectedAddress._id);
      setPaymentData(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Unable to start checkout"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      <div className="sticky top-20 rounded-2xl border border-onyx-border/70 bg-onyx-surface p-6 sm:p-8">
        <h2 className="mb-6 border-b border-onyx-border/70 pb-5 font-serif text-xl font-light tracking-tight text-onyx-text">
          Order Summary
        </h2>

        {/* Selected Shipping Destination Badge */}
        {selectedAddress ? (
          <div className="mb-5 rounded-xl border border-onyx-border/60 bg-onyx-card/60 p-3.5 transition-all">
            <div className="flex items-center justify-between text-[10px] text-onyx-muted uppercase tracking-[0.14em] font-semibold mb-1">
              <span className="text-onyx-gold flex items-center gap-1">
                <span>📍</span>
                <span>Deliver To</span>
              </span>
              <span>{selectedAddress.zip}</span>
            </div>
            <p className="font-medium text-xs text-onyx-text truncate">
              {selectedAddress.name} ({selectedAddress.phone})
            </p>
            <p className="text-onyx-muted truncate text-[11px] mt-0.5">
              {selectedAddress.addressLine}, {selectedAddress.city}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onPromptAddress}
            className="mb-5 w-full rounded-xl border border-dashed border-onyx-gold/40 bg-onyx-gold-muted/30 p-3 text-center text-xs text-onyx-gold hover:bg-onyx-gold-muted/50 transition-colors"
          >
            + Select / Add Delivery Address
          </button>
        )}

        <div className="space-y-3">
          <div className="flex justify-between border-b border-onyx-border/60 pb-3 text-xs">
            <span className="text-onyx-muted/70">
              Subtotal ({count} {count === 1 ? "item" : "items"})
            </span>

            <span className="text-onyx-text">
              {currency} {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-onyx-muted/70">Shipping</span>

            <span
              className={shipping === 0 ? "text-emerald-400" : "text-onyx-text"}
            >
              {shipping === 0 ? "Free" : `${currency} ${shipping}`}
            </span>
          </div>
        </div>

        <hr className="my-4 border-onyx-border/70" />

        <div className="flex justify-between pb-6 items-baseline">
          <span className="text-xs uppercase tracking-wider text-onyx-muted">
            Total
          </span>

          <span className="text-2xl font-semibold text-onyx-gold">
            {currency} {total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isCheckoutLoading}
          className="onyx-btn-primary flex w-full justify-between px-6"
        >
          <span>
            {isCheckoutLoading
              ? "Preparing payment..."
              : selectedAddress
              ? "Proceed to Payment"
              : "Select Address to Pay"}
          </span>
          <span>→</span>
        </button>

        <Link
          to="/"
          className="onyx-btn-secondary mt-3 block text-center !text-onyx-text hover:!text-onyx-gold"
        >
          Continue Shopping
        </Link>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-onyx-border/60 bg-white/5 px-4 py-3">
          <span>🔒</span>

          <span className="text-[11px] text-onyx-muted/60">
            Secure checkout · 256-bit SSL encryption
          </span>
        </div>
      </div>

      {paymentData && (
        <RazorPay
          key={paymentData.id}
          orderId={paymentData.id}
          amount={paymentData.amount}
          currency={paymentData.currency || currency}
        />
      )}
    </>
  );
};

export default OrderSummary;
