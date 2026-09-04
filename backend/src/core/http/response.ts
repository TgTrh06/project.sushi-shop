import type { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class HttpResponse {
  static success<T>(res: Response, data: T, message = "Success", status = 200) {
    return res.status(status).json({ success: true, message, data } satisfies ApiResponse<T>);
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return HttpResponse.success(res, data, message, 201);
  }
}
