import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    const newOrder = new Order({
      user: userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "placed"
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Optional: Check if user owns the order (or if admin)
    if (order.user.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, message: "Unauthorized access to order" });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, message: "Unauthorized to cancel this order" });
    }

    // Only allow cancellation if placed or processing
    if (["shipped", "out_for_delivery", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order in ${order.status} state` });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};
