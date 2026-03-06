import { Response } from "express";

export class ResponseHandler {
  // Trả về thành công (200 OK)
  static success(res: Response, data: any, message = "Thành công", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Trả về khi tạo mới thành công (201 Created)
  static created(res: Response, data: any, message = "Đã tạo mới thành công") {
    return this.success(res, data, message, 201);
  }

  // Trả về dữ liệu có phân trang (Pagination)
  static paginate(res: Response, data: any[], total: number, page: number, limit: number) {
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách thành công",
      data,
      metadata: {
        totalDocs: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
      },
    });
  }
}