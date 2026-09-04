import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import type { GetSystemStatsUseCase } from "../../application/use-cases/get-system-stats.use-case";
export class StatsController { constructor(private readonly getStats: GetSystemStatsUseCase) {} get = async (_req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.getStats.execute(), "System stats retrieved successfully."); } catch (e) { next(e); } }; }
