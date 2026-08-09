import { Router } from "express";
import type { StatsController } from "../controllers/stats.controller";
export function createStatsRoutes(controller: StatsController, auth: any, admin: any) { const router = Router(); router.get("/", auth, admin, controller.get); return router; }
