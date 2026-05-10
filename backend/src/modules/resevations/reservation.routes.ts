import { Router } from "express";
import { reservationController } from "@/container/reservation.container";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";

const router = Router();

// PUBLIC ROUTES
router.post("/", verifyAuth, reservationController.create); // Create reservation (requires auth)
router.get("/vnpay-return", reservationController.vnpayReturn); // VNPay callback
router.get("/occupied-seats", reservationController.getOccupiedSeats); // Get occupied seats

// USER ROUTES
router.get("/my-reservations", verifyAuth, reservationController.getMyReservations); // Get user's reservations

// ADMIN ROUTES
router.get("/", verifyAuth, verifyAdmin, reservationController.getAll); // Get all reservations

export default router;