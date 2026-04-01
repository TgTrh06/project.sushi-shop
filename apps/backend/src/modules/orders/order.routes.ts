import { Router } from "express";
import OrderController from "../modules/orders/order.controller";

const router = Router();

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);

export default router;