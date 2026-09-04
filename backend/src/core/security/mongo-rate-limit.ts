import type { NextFunction, Request, Response } from "express";
import { Schema, model, type Document } from "mongoose";
import { InternalServerError } from "@/core/errors";
import { logger } from "@/core/logging/logger";

interface RateLimitDocument extends Document { key: string; windowStart: Date; count: number; expiresAt: Date; }
const schema = new Schema<RateLimitDocument>({ key: { type: String, required: true }, windowStart: { type: Date, required: true }, count: { type: Number, required: true }, expiresAt: { type: Date, required: true } });
schema.index({ key: 1, windowStart: 1 }, { unique: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const RateLimitModel = model<RateLimitDocument>("RateLimitBucket", schema);

export function createMongoRateLimiter(name: string, windowMs: number, max: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const windowStartMs = Math.floor(now / windowMs) * windowMs;
    const windowStart = new Date(windowStartMs);
    const expiresAt = new Date(windowStartMs + windowMs + 60_000);
    const key = `${name}:${req.ip || req.socket.remoteAddress || "unknown"}`;
    try {
      const bucket = await RateLimitModel.findOneAndUpdate(
        { key, windowStart },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      ).lean();
      const remaining = Math.max(0, max - bucket.count);
      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", remaining);
      res.setHeader("RateLimit-Reset", Math.ceil((windowStartMs + windowMs) / 1000));
      if (bucket.count > max) { res.status(429).json({ success: false, message: "Too many requests" }); return; }
      next();
    } catch (error) {
      logger.error("Rate limit service unavailable", {
        limiter: name,
        error: error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
      });
      next(new InternalServerError("Rate limit service unavailable"));
    }
  };
}
