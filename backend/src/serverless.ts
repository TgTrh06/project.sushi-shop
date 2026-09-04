import type { Request, Response, NextFunction } from "express";
import app from "./bootstrap/app";
import { connectDatabase } from "@/core/database/mongoose.connection";
import { ensureSessionIndexes } from "@/modules/auth/infrastructure/mongoose/session.model";

export default async function handler(req: Request, res: Response, next: NextFunction) {
  try {
    await connectDatabase();
    await ensureSessionIndexes();
    return app(req, res, next);
  } catch (error) {
    next(error);
  }
}
