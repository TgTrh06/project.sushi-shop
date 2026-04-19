import { Request, Response, NextFunction } from "express";
import { bookingService } from "./booking.service";
import { ResponseHandler } from "../../utils/common/response.utils";
import { GetByIdParams } from "@/types/params.type";

export const bookingController = {
  // POST /bookings — Public: Customer creates a booking
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bookingService.createBooking(req.body);
      return ResponseHandler.created(res, data, "Booking created successfully.");
    } catch (error) {
      next(error);
    }
  },

  // GET /admin/bookings — Admin: Get all bookings
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bookingService.getBookings();
      return ResponseHandler.success(res, data, "Bookings retrieved successfully.");
    } catch (error) {
      next(error);
    }
  },

  // PATCH /admin/bookings/:id/status — Admin: Update booking status
  async updateStatus(req: Request<GetByIdParams>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await bookingService.updateStatus(id, status);
      return ResponseHandler.success(res, data, "Booking status updated successfully.");
    } catch (error) {
      next(error);
    }
  },

  // DELETE /admin/bookings/:id — Admin: Delete a booking
  async delete(req: Request<GetByIdParams>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await bookingService.deleteBooking(id);
      return ResponseHandler.success(res, null, "Booking deleted successfully.");
    } catch (error) {
      next(error);
    }
  },
};