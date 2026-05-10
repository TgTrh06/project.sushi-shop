import { Response } from "express";
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "./error.util";

export class ResponseHandler {
  // Return success response (200 OK)
  static success(res: Response, data: any, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Return created response (201 Created)
  static created(res: Response, data: any, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  // Return bad request response (400 Bad Request)
  static badRequest(message = "Bad Request") {
    return new BadRequestError(message);
  }

  // Return unauthorized response (401 Unauthorized)
  static unauthorized(message = "Unauthorized") {
    return new UnauthorizedError(message);
  }

  // Return forbidden response (403 Forbidden)
  static forbidden(message = "Forbidden") {
    return new ForbiddenError(message);
  }

  // Return not found response (404 Not Found)
  static notFound(message = "Not Found") {
    return new NotFoundError(message);
  }

  // Return conflict response (409 Conflict)
  static conflict(message = "Conflict") {
    return new ConflictError(message);
  }

  // Return internal server error response (500 Internal Server Error)
  static internalServerError(message = "An error occurred") {
    return new InternalServerError(message);
  }
}