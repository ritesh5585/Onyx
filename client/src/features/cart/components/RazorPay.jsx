import { useEffect } from "react";
import { useRazorpay } from "react-razorpay";
import { useAuth } from "../../auth/hook/useAuth";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { resetCart } from "../state/cart.slice";

const RazorPay = ({ orderId, amount, currency }) => {
  const { Razorpay } = useRazorpay();
  const { user } = useAuth();
  const { verifyPayment } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Razorpay || !orderId || !amount) return;

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast.error("Payment gateway is not configured");
      return;
    }

    try {
      const razorpay = new Razorpay({
        key,
        amount,
        currency: currency || "INR",
        name: "ONYX",
        description: "E-commerce platform",
        order_id: orderId,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            toast.success("Payment successful! Your order has been placed.");
            dispatch(resetCart());
            navigate("/my-orders");
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullname || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#c49a52" },
      });
      razorpay.on("payment.failed", (r) => {
        toast.error(r.error?.description || "Payment failed");
      });
      razorpay.open();
    } catch (err) {
      console.error("Unable to open Razorpay", err);
      toast.error("Unable to open payment gateway");
    }
  }, [Razorpay, orderId, amount, currency, user, verifyPayment, navigate, dispatch]);

  return null;
};

export default RazorPay;
