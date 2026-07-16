import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { createOrderPayment } from "../controller/payment.controller.js";

const router = Router()

/**
 * @route PATCH /api/payment/create/order
 * @description razorpay access for payment of order by customer this route
*/
router.post('/create/order', authenticateUser, createOrderPayment)

export default router