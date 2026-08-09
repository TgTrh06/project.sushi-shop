import { Router } from "express";
import { reservationController } from "@/composition-root";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import { zodValidator } from "@/middleware/validate.middleware";
import { CreateReservationSchema } from "@itsu-sushi/shared/schemas/reservation.schema";
import { reservationRateLimiter } from "@/config/rateLimit.config";

const router = Router();

// PUBLIC ROUTES
router.get("/vnpay-return", reservationController.vnpayReturn); // VNPay callback
router.get("/occupied-seats", reservationController.getOccupiedSeats); // Get occupied seats

// USER ROUTES (must be before generic routes to avoid conflicts)
router.get("/my-reservations", verifyAuth, reservationController.getMyReservations); // Get user's reservations
  router.post("/", reservationRateLimiter, verifyAuth, zodValidator(CreateReservationSchema), reservationController.create); // Create reservation (requires auth)

// ADMIN ROUTES
router.get("/", verifyAuth, verifyAdmin, reservationController.getAll); // Get all reservations
router.get("/:id", verifyAuth, verifyAdmin, reservationController.getById); // Get reservation by ID
router.patch("/:id/status", verifyAuth, verifyAdmin, reservationController.updateStatus); // Update status
router.delete("/:id", verifyAuth, verifyAdmin, reservationController.delete); // Delete reservation

export default router;
