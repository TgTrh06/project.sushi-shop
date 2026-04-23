import { Request, Response, NextFunction } from "express";
import ReservationService from "./reservation.service";
import { ResponseHandler } from "../../utils/common/response.util";
import { GetByIdParams } from "@/types/params.type";
import { BadRequestError } from "@/utils/common/error.util";

export default class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  // POST /bookings — Public: Customer creates a booking
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";
      const data = await this.reservationService.createBooking(req.body, ip);
      return ResponseHandler.created(res, data, "Booking created successfully.");
    } catch (error) {
      next(error);
    }
  };

  // GET /admin/bookings — Admin: Get all bookings
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.reservationService.getBookings();
      return ResponseHandler.success(res, data, "Bookings retrieved successfully.");
    } catch (error) {
      next(error);
    }
  };

  // PATCH /admin/bookings/:id/status — Admin: Update booking status
  updateStatus = async (req: Request<GetByIdParams>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await this.reservationService.updateStatus(id, status);
      return ResponseHandler.success(res, data, "Booking status updated successfully.");
    } catch (error) {
      next(error);
    }
  };

  // GET /bookings/vnpay_return
  vnpayReturn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reservationService.handleVNPayReturn(req.query);
      return ResponseHandler.success(res, result, "VNPay Return Processed");
    } catch (error) {
      next(error);
    }
  };

  // GET /bookings/vnpay_ipn
  vnpayIpn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.reservationService.handleVNPayIPN(req.query);
      // VNPay IPN requires specific response format: RspCode and Message returned directly
      return ResponseHandler.success(res, result, "VNPay IPN Processed");
    } catch (error) {
      // In case of system error, VNPay expects RspCode "99"
      return new BadRequestError("Unknown error");
    }
  };

  // GET /resevations/occupied-seats
  getOccupiedSeats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, slot } = req.query;
      if (!date || !slot) {
        return new BadRequestError("Date and slot are required.");
      }
      const data = await this.reservationService.getOccupiedSeats(date as string, slot as string);
      return ResponseHandler.success(res, data, "Occupied seats retrieved successfully.");
    } catch (error) {
      next(error);
    }
  };
}