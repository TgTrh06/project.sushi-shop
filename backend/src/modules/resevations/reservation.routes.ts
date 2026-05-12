import { Router } from "express";
import { reservationController } from "@/container/reservation.container";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";

const router = Router();

// PUBLIC ROUTES
router.get("/vnpay-return", reservationController.vnpayReturn); // VNPay callback
router.get("/occupied-seats", reservationController.getOccupiedSeats); // Get occupied seats

// USER ROUTES (must be before generic routes to avoid conflicts)
router.get("/my-reservations", verifyAuth, reservationController.getMyReservations); // Get user's reservations
router.post("/", verifyAuth, reservationController.create); // Create reservation (requires auth)

// ADMIN ROUTES
router.get("/", verifyAuth, verifyAdmin, reservationController.getAll); // Get all reservations

export default router;