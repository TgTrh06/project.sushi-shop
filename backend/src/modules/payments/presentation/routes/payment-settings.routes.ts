import { Router } from "express";
import type { PaymentSettingsController } from "../controllers/payment-settings.controller";
import { validateBody } from "@/core/http/validation.middleware";
import { PaymentSettingsSchema } from "../validators/payment-settings.validator";
export function createPaymentSettingsRoutes(controller: PaymentSettingsController, auth: any, admin: any) { const router = Router(); router.get("/", auth, admin, controller.getSettings); router.put("/", auth, admin, validateBody(PaymentSettingsSchema), controller.update); return router; }
