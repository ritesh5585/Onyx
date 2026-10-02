import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const trackingEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // The User model seems to be exported as 'user' or 'User'.
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    trackingEvents: [trackingEventSchema],
  },
  { timestamps: true },
);

// Middleware to automatically add tracking event when status changes
orderSchema.pre("save", async function () {
  if (this.isModified("status")) {
    const defaultDescriptions = {
      placed: "Order placed successfully",
      processing: "Order is being packed",
      shipped: "Package handed to courier",
      out_for_delivery: "Out for delivery",
      delivered: "Delivered to customer",
      cancelled: "Order cancelled",
    };

    this.trackingEvents.push({
      status: this.status,
      date: new Date(),
      description:
        defaultDescriptions[this.status] || `Status updated to ${this.status}`,
    });
  }
});

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
