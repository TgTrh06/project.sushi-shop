import { Router } from "express";
import { bookingController } from "./booking.controller";
import { verifyAuth, verifyAdmin } from "../../middleware/auth.middleware";

const router = Router();

// PUBLIC ROUTES
router.post("/", bookingController.create); // Customer creates booking

// ADMIN ROUTES
router.get("/", verifyAuth, verifyAdmin, bookingController.getAll);
router.patch("/:id/status", verifyAuth, verifyAdmin, bookingController.updateStatus);
router.delete("/:id", verifyAuth, verifyAdmin, bookingController.delete);

export default router;
