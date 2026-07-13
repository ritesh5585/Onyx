import { useEffect } from "react";
import { useRazorpay } from "react-razorpay";
import { useAuth } from "../../auth/hook/useAuth";

const RazorPay = ({ orderId, amount, currency }) => {
  const { Razorpay } = useRazorpay();
  const { user } = useAuth();

  useEffect(() => {
    if (!Razorpay || !orderId) return;

    try {
      const razorpay = new Razorpay({
        key: "rzp_test_SldkzeX392DYuC",
        amount: amount * 100,
        currency: currency || "INR",
        name: "ONYX",
        description: "E-commerce platform",
        order_id: orderId,
        handler: (r) => {
          console.log("Payment Successfull:", r);
        },
        prefill: {
          name: user?.fullname || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#c49a52" },
      });
      razorpay.on("payment.failed", (r) => {
        console.error("Payment failed: ", r.error.description);
      });
      razorpay.open();
    } catch (err) {
      console.error(err);
    }
  }, [Razorpay, orderId, amount, currency, user]);

  return null;
};

export default RazorPay;
