import { Router } from "express";
import { reservationController } from "@/container/reservation.container";
import { verifyAuth, verifyAdmin } from "../../middleware/auth.middleware";

const router = Router();

// PUBLIC ROUTES
router.post("/", verifyAuth, reservationController.create); // Customer creates booking
router.get("/vnpay_return", reservationController.vnpayReturn); // VNPay sync callback
router.get("/vnpay_ipn", reservationController.vnpayIpn); // VNPay async webhook

// ADMIN ROUTES
router.get("/", verifyAuth, verifyAdmin, reservationController.getAll);
router.patch("/:id/status", verifyAuth, verifyAdmin, reservationController.updateStatus);

export default router;
