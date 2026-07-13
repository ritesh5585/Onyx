import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../hooks/useCart";
import RazorPay from "./RazorPay";

const OrderSummary = ({ count, subtotal, shipping, total, currency }) => {
  const { handleOrderPayment } = useCart();

  const [paymentData, setPaymentData] = useState(null);

  const handleCheckout = async () => {
    try {
      setPaymentData(null);
      const data = await handleOrderPayment();
      if (data?.id) setPaymentData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="sticky top-20 rounded-2xl border border-onyx-border/70 bg-onyx-surface p-6 sm:p-8">
        <h2 className="mb-6 border-b border-onyx-border/70 pb-5 font-serif text-xl font-light tracking-tight text-onyx-text">
          Order Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between border-b border-onyx-border/60 pb-3">
            <span className="text-[12px] text-onyx-muted/70">
              Subtotal ({count} {count === 1 ? "item" : "items"})
            </span>

            <span>
              {currency} {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[12px] text-onyx-muted/70">Shipping</span>

            <span
              className={shipping === 0 ? "text-emerald-400" : "text-onyx-text"}
            >
              {shipping === 0 ? "Free" : `${currency} ${shipping}`}
            </span>
          </div>
        </div>

        <hr className="my-4 border-onyx-border/70" />

        <div className="flex justify-between pb-6">
          <span>Total</span>

          <span className="text-2xl font-semibold text-onyx-gold">
            {currency} {total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="onyx-btn-primary flex w-full justify-between px-6"
        >
          <span>Proceed to Checkout</span>
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
          amount={total}
          currency={currency}
        />
      )}
    </>
  );
};

export default OrderSummary;
