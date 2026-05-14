import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "@/utils/common/response.util";
import ReservationService from "./reservation.service";
import { BadRequestError } from "@/utils/common/error.util";

export default class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    /**
     * POST /reservations - Create a new reservation
     * Body: { customerName, customerPhone, reservationDate, session, slotId, seatCodes, totalDeposit }
     */
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ipAddr = (req.headers["x-forwarded-for"] as string) ||
                req.socket.remoteAddress ||
                "127.0.0.1";

            const userId = req.user!.id; // Required - from auth middleware

            const result = await this.reservationService.createReservation(
                req.body,
                ipAddr,
                userId
            );

            return ResponseHandler.created(res, result, "Reservation created successfully!");
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /reservations/vnpay-return - VNPay callback handler
     */
    vnpayReturn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.reservationService.handleVNPayCallback(req.query);

            if (result) {
                // Redirect to success page
                return res.redirect(
                    `${process.env.FRONTEND_URL}/reservation-success?ref=${result.vnp_TxnRef}`
                );
            }

            // Redirect to failure page
            return res.redirect(`${process.env.FRONTEND_URL}/reservation-failed`);
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /reservations/occupied-seats - Get occupied seats for a specific date/session/slot
     * Query: { date, session, slotId }
     */
    getOccupiedSeats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { date, session, slotId } = req.query;

            if (!date || !session || !slotId) {
                throw new BadRequestError("date, session, and slotId are required");
            }

            const occupiedSeats = await this.reservationService.getOccupiedSeats(
                date as string,
                session as string,
                slotId as string
            );

            return ResponseHandler.success(res, occupiedSeats, "Occupied seats retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /reservations/my-reservations - Get current user's reservations
     */
    getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id; // Required - from auth middleware
            const data = await this.reservationService.getReservationsByUserId(userId);
            return ResponseHandler.success(res, data, "Your reservations retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /reservations - Get all reservations (admin only)
     */
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.reservationService.getReservations();
            return ResponseHandler.success(res, data, "Reservations retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /reservations/:id - Get reservation by ID (admin only)
     */
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = await this.reservationService.getReservationById(id);
            
            if (!data) {
                throw new BadRequestError("Reservation not found");
            }

            return ResponseHandler.success(res, data, "Reservation retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    /**
     * PATCH /reservations/:id/status - Update reservation status (admin only)
     */
    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const { status } = req.body;

            if (!status) {
                throw new BadRequestError("Status is required");
            }

            const data = await this.reservationService.updateReservationStatus(id, status);
            return ResponseHandler.success(res, data, "Reservation status updated successfully");
        } catch (error) {
            next(error);
        }
    };

    /**
     * DELETE /reservations/:id - Delete reservation (admin only)
     */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            await this.reservationService.deleteReservation(id);
            return ResponseHandler.success(res, null, "Reservation deleted successfully");
        } catch (error) {
            next(error);
        }
    };
}