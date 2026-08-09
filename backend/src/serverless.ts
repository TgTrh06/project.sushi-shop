import type { Request, Response, NextFunction } from "express";
import app from "./app";
import { connectDatabase } from "@/core/database/mongoose.connection";

export default async function handler(req: Request, res: Response, next: NextFunction) {
  try {
    await connectDatabase();
    return app(req, res, next);
  } catch (error) {
    next(error);
  }
}
