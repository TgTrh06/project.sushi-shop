import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { BadRequestError } from "@/utils/common/error.util";

export const zodValidator = (schema: ZodType<any>) => 
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Unwrap the input property if it exists (for client requests that wrap data)
      const dataToValidate = req.body.input || req.body;
      
      // Using parseAsync to support async refine/transform in Zod schemas
      req.body = await schema.parseAsync(dataToValidate);
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