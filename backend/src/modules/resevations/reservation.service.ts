import ReservationRepository from "./reservation.repository";
import { BadRequestError } from "@/utils/common/error.util";
import { vnpay, ProductCode, VnpLocale, dateFormat } from "@/utils/payment/vnpay.util";
import { CreateReservationInput } from "./reservation.types";
import { calculateDeposit, RESERVATION_CONFIG } from "@shared/config/reservation.config";

export default class ReservationService {
    constructor(private readonly reservationRepo = new ReservationRepository()) { }

    /**
     * Create a new reservation and generate VNPay payment URL
     */
    async createReservation(data: CreateReservationInput, ipAddr: string, userId?: string) {
        // Calculate deposit dynamically
        const totalDeposit = calculateDeposit(data.seatCodes.length);

        // Validate deposit matches
        if (data.totalDeposit !== totalDeposit) {
            throw new BadRequestError(`Invalid deposit amount. Expected ${totalDeposit} VND`);
        }

        // Generate unique transaction reference
        const txnRef = `RES_${Date.now()}`;

        // Calculate payment expiry time
        const paymentExpiredAt = new Date();
        paymentExpiredAt.setMinutes(paymentExpiredAt.getMinutes() + RESERVATION_CONFIG.paymentExpiryMinutes);

        // Create reservation in database
        const reservation = await this.reservationRepo.create({
            ...data,
            userId,
            vnp_TxnRef: txnRef,
            status: "PENDING_PAYMENT",
            paymentExpiredAt,
        });

        // Generate VNPay payment URL
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: totalDeposit,
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Reservation ${data.session} - ${data.slotId}`,
            vnp_OrderType: ProductCode.Cuisine,
            vnp_ReturnUrl: process.env.VNP_RETURN_URL!,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(paymentExpiredAt),
        });

        return { reservation, paymentUrl };
    }

    /**
     * Handle VNPay callback after payment
     */
    async handleVNPayCallback(query: any) {
        const verify = vnpay.verifyReturnUrl(query);

        if (!verify.isVerified) {
            throw new BadRequestError("Invalid payment signature");
        }

        const txnRef = verify.vnp_TxnRef;

        // Payment successful
        if (verify.vnp_ResponseCode === "00") {
            const updated = await this.reservationRepo.updateStatus(txnRef, "PAID");
            return updated;
        }

        // Payment failed or cancelled
        const updated = await this.reservationRepo.updateStatus(txnRef, "CANCELLED");
        return updated;
    }

    /**
     * Get all reservations (admin)
     */
    async getReservations() {
        return await this.reservationRepo.findAll();
    }

    /**
     * Get reservations by user ID
     */
    async getReservationsByUserId(userId: string) {
        return await this.reservationRepo.findByUserId(userId);
    }

    /**
     * Get occupied seats for a specific date, session, and slot
     */
    async getOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]> {
        return await this.reservationRepo.findOccupiedSeats(date, session, slotId);
    }
}