import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { CreateReservationSchema, ApprovePaymentSchema, RejectPaymentSchema } from "../validators/reservation.validator";
import type { ReservationController } from "../controllers/reservation.controller";

export function createReservationRoutes(controller: ReservationController, auth: any, admin: any, rateLimiter: any) {
  const router = Router();
  router.get("/config", controller.configHandler);
  router.get("/occupied-seats", controller.occupiedHandler);
  router.get("/my-reservations", auth, controller.mineHandler);
  router.post("/", rateLimiter, auth, validateBody(CreateReservationSchema), controller.createHandler);
  router.get("/", auth, admin, controller.getAll);
  router.get("/:id/payment", auth, controller.getPayment);
  router.post("/:id/confirm-payment", auth, controller.confirmPayment);
  router.post("/:id/approve-payment", auth, admin, validateBody(ApprovePaymentSchema), controller.approvePayment);
  router.post("/:id/reject-payment", auth, admin, validateBody(RejectPaymentSchema), controller.rejectPayment);
  router.get("/:id", auth, admin, controller.getById);
  router.patch("/:id/status", auth, admin, controller.update);
  router.delete("/:id", auth, admin, controller.delete);
  return router;
}
