import ReservationRepository from "./reservation.repository";
import { ReservationModel } from "./reservation.model"
import { BadRequestError, NotFoundError } from "@/utils/common/error.util";

import { vnpay, ProductCode, VnpLocale, dateFormat } from "@/utils/payment/vnpay.util";
import { CreateReservationInput } from "./reservation.types";

export default class ReservationService {
    constructor(private readonly reservationRepo = new ReservationRepository()) { }

    async createReservation(data: CreateReservationInput, ipAddr: string) {
        const txnRef = `RES_${Date.now()}`;

        const reservation = await this.reservationRepo.create({
            ...data,
            vnp_TxnRef: txnRef,
            status: "PENDING_PAYMENT",
        });

        const expiredTime = new Date();

        expiredTime.setMinutes(expiredTime.getMinutes() + 15);

        const paymentUrl =
            vnpay.buildPaymentUrl({
                vnp_Amount: data.totalDeposit,

                vnp_IpAddr: ipAddr,
                vnp_TxnRef: txnRef,

                vnp_OrderInfo: "Dat ban Itsu Sushi",
                vnp_OrderType: ProductCode.Cuisine,

                vnp_ReturnUrl: process.env.VNP_RETURN_URL!,

                vnp_Locale: VnpLocale.VN,

                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(expiredTime),
            });

        return { reservation, paymentUrl };
    }

    // --- VNPAY CALLBACK ---
    async handleVNPayCallback(query: any) {
        const verify = vnpay.verifyReturnUrl(query);

        if (!verify.isVerified) {
            throw new BadRequestError("Invalid signature");
        }

        const txnRef = verify.vnp_TxnRef;

        if (verify.vnp_ResponseCode === "00") {
            const updated = await this.reservationRepo.updateStatus(txnRef, "PAID");

            console.log("UPDATED:", updated);

            return updated;
        }

        const result = await this.reservationRepo.updateStatus(txnRef, "CANCELLED");
        return result;
    }

    async getReservations() {
        return await this.reservationRepo.findAll();
    }

    // async getOccupiedSeats(date: string, timeSlot: string) {
    //     return await this.reservationRepo.findOccupiedSeats(date, timeSlot);
    // }
}