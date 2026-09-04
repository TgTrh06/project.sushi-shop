import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { BadRequestError } from "@/core/errors";

export function validateBody(schema: ZodType) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body?.input ?? req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new BadRequestError(error.issues.map((issue) => issue.message).join(", ")));
        return;
      }
      next(error);
    }
  };
}
