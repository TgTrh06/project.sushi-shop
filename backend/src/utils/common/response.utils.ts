import { Response } from "express";

export class ResponseHandler {
  // Trả về thành công (200 OK)
  static success(res: Response, data: any, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Trả về khi tạo mới thành công (201 Created)
  static created(res: Response, data: any, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }
}