import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { BadRequestError } from "@/utils/common/error.utils";

export const zodValidator = (schema: ZodType<any>) => 
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Using parseAsync to support async refine/transform in Zod schemas
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Extract all error messages and join them into a single string
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        
        return next(new BadRequestError(errorMessage));
      }
      next(error);
    }
  };