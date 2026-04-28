import { Router } from "express";
import StatsController from "./stats.controller";

const router = Router();
const controller = new StatsController();

// GET /admin/stats — protected at the router level in routes/index.ts
router.get("/", controller.getSystemStats);

export default router;
