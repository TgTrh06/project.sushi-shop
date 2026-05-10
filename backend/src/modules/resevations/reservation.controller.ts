import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "@/utils/common/response.util";
import ReservationService from "./reservation.service";
import { GetByIdParams } from "@/types/params.type";
import { BadRequestError } from "@/utils/common/error.util";


export default class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    // POST /bookings — Public: Customer creates a booking
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ipAddr = (req.headers["x-forwarded-for"] as string) ||
                req.socket.remoteAddress ||
                "127.0.0.1";
            const result = await this.reservationService.createReservation(
                {
                    customerName: "Trinh Thanh Tung",
                    customerPhone: "0988888666",

                    seatCodes: ["T-02", "T-03"],
                    reservationDate: "2026-05-15",
                    timeSlot: "18:00",

                    totalDeposit: 200000,
                },
                ipAddr
            );
            return ResponseHandler.created(res, result, "Create reservation successfully!");
        } catch (error) {
            next(error);
        }
    };

    // GET /reservations/vnpay-return
    vnpayReturn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const success = await this.reservationService.handleVNPayCallback(req.query);

            if (success) {
                // return res.redirect(
                //     "http://localhost:5173/payment-success"
                // );
                return ResponseHandler.success(res, success, "VNPay Return Processed");
            }

            return res.send(`VNPay return: {success}`);  
        } catch (error) {
            next(error);
        }
    };

    // GET /admin/reservations — Admin: Get all bookings
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.reservationService.getReservations();
            return ResponseHandler.success(res, data, "Bookings retrieved successfully.");
        } catch (error) {
            next(error);
        }
    };

    // PATCH /admin/reservations/:id/status — Admin: Update booking status
    // updateStatus = async (req: Request<GetByIdParams>, res: Response, next: NextFunction) => {
    //     try {
    //         const { id } = req.params;
    //         const { status } = req.body;
    //         const data = await this.this.reservationService.updateStatus(id, status);
    //         return ResponseHandler.success(res, data, "Booking status updated successfully.");
    //     } catch (error) {
    //         next(error);
    //     }
    // };


    // GET /reservations/vnpay_ipn
    //   vnpayIpn = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //       const result = await this.this.reservationService.handleVNPayIPN(req.query);
    //       // VNPay IPN requires specific response format: RspCode and Message returned directly
    //       return ResponseHandler.success(res, result, "VNPay IPN Processed");
    //     } catch (error) {
    //       // In case of system error, VNPay expects RspCode "99"
    //       return new BadRequestError("Unknown error");
    //     }
    //   };

    // GET /resevations/occupied-seats
    //   getOccupiedSeats = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //       const { date, slot } = req.query;
    //       if (!date || !slot) {
    //         return new BadRequestError("Date and slot are required.");
    //       }
    //       const data = await this.this.reservationService.getOccupiedSeats(date as string, slot as string);
    //       return ResponseHandler.success(res, data, "Occupied seats retrieved successfully.");
    //     } catch (error) {
    //       next(error);
    //     }
    //   };
}