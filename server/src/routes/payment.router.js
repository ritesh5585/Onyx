import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createOrderPayment, verifyPayment } from "../controller/payment.controller.js";

const router = Router()

/**
 * @route PATCH /api/payment/create/order
 * @description razorpay access for payment of order by customer this route
*/
router.post('/create/order', authenticateUser, createOrderPayment)

/**
 * @route PATCH /api/payment/verify
 * @description razorpay verify the user for payment
*/
router.post("/verify", authenticateUser, verifyPayment);

export default router