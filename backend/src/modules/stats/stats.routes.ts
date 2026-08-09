import { Router } from "express";
import StatsController from "./stats.controller";
import { statsController } from "@/composition-root";

const router = Router();
const controller: StatsController = statsController;

// GET /admin/stats — protected at the router level in routes/index.ts
router.get("/", controller.getSystemStats);

export default router;
