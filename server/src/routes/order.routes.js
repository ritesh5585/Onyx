import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} from "../controller/order.controller.js";

const router = Router();

/**
 * @route POST /api/order
 * @description Create a new order
 */
router.post("/", authenticateUser, createOrder);

/**
 * @route GET /api/order
 * @description Get all orders for the authenticated user
 */
router.get("/", authenticateUser, getMyOrders);

/**
 * @route GET /api/order/:id
 * @description Get order by ID
 */
router.get("/:id", authenticateUser, getOrderById);

/**
 * @route PATCH /api/order/:id/cancel
 * @description Cancel an order
 */
router.patch("/:id/cancel", authenticateUser, cancelOrder);

/**
 * @route PATCH /api/order/:id/status
 * @description DEV-ONLY: Manually update order status to test timeline
 */
router.patch("/:id/status", authenticateUser, updateOrderStatus);

export default router;
