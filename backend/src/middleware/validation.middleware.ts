import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/common/error";

export function validationMiddleware(dtoClass: any) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true, // Delete attributes which are not defined
      forbidNonWhitelisted: true, // Report if strange attributes are posted
    })

    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints || {}).join(', '))
        .join('; ');

      return next(new BadRequestError(message));
    }

    req.body = dtoInstance;
    next();
  }
}