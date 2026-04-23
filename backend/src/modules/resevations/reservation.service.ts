import ReservationRepository from "./reservation.repository";
import { generateVNPayUrl, verifyVNPayResponse } from "@/utils/common/vnpay.util";
import { ReservationModel } from "./reservation.model"
import { NotFoundError } from "@/utils/common/error.util";

export default class ReservationService {
  constructor(private readonly reservationRepo = new ReservationRepository()) {}

  // Tạo đơn đặt và lấy URL thanh toán
  async createBooking(data: any, ip: string) {
    const txnRef = Date.now().toString(); // Dùng timestamp làm mã GD
    const reservation = await this.reservationRepo.create({
      ...data,
      vnp_TxnRef: txnRef,
      status: "PENDING_PAYMENT"
    });

    const paymentUrl = generateVNPayUrl({
      amount: data.totalDeposit,
      txnRef: txnRef,
      ipAddr: ip,
      orderInfo: `Thanh toan ghe ItsuSushi: ${data.seatIds.join(", ")}`
    });

    return { reservation, paymentUrl };
  }

  // Xử lý hủy và hoàn tiền
  async cancelBooking(resId: string) {
    const res = await ReservationModel.findById(resId);
    if (!res) throw new Error("Không tìm thấy đơn đặt");

    const resTime = new Date(`${res.reservationDate} ${res.timeSlot}`);
    const now = new Date();

    if (now < resTime) {
      // Logic gọi VNPay API Refund 100% ở đây
      await this.reservationRepo.updateStatus(resId, "CANCELLED_REFUNDED");
      return { message: "Đã hủy và hoàn tiền cọc 100%" };
    } else {
      await this.reservationRepo.updateStatus(resId, "CANCELLED_NO_REFUND");
      return { message: "Hủy thành công nhưng không được hoàn tiền (quá giờ)" };
    }
  }

  async getBookings() {
    return this.reservationRepo.findAll();
  }

  async getBookingById(id: string) {
    const booking = await this.reservationRepo.findById(id);
    if (!booking) throw new NotFoundError("Reservation not found");
    return booking;
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.reservationRepo.updateStatus(id, status);
    if (!booking) throw new NotFoundError("Reservation not found");
    return booking;
  }

  // --- THÊM XỬ LÝ VNPAY CALLBACK ---
  async handleVNPayReturn(vnp_Params: any) {
    const isValidSignature = verifyVNPayResponse(vnp_Params);
    if (!isValidSignature) {
      throw new Error("Invalid VNPay signature");
    }

    const responseCode = vnp_Params["vnp_ResponseCode"];
    return { isSuccess: responseCode === "00" };
  }

  async handleVNPayIPN(vnp_Params: any) {
    const isValidSignature = verifyVNPayResponse(vnp_Params);
    if (!isValidSignature) {
      return { RspCode: "97", Message: "Invalid signature" };
    }

    const txnRef = vnp_Params["vnp_TxnRef"];
    const amount = vnp_Params["vnp_Amount"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    // Find the reservation
    const reservation = await this.reservationRepo.findByTxnRef(txnRef);
    if (!reservation) {
      return { RspCode: "01", Message: "Order not found" };
    }

    // Amount needs to match. vnp_Amount is multiplied by 100
    const paymentAmount = reservation.totalDeposit * 100;
    if (Number(amount) !== paymentAmount) {
      return { RspCode: "04", Message: "Invalid amount" };
    }

    // Check if order is already processed
    if (reservation.status !== "PENDING_PAYMENT") {
      return { RspCode: "02", Message: "Order already confirmed" };
    }

    // Update status based on VNPay response
    if (responseCode === "00") {
      // Payment success
      await this.reservationRepo.updateStatus(reservation.id, "CONFIRMED");
    } else {
      // Payment failed or canceled
      await this.reservationRepo.updateStatus(reservation.id, "CANCELLED");
    }

    return { RspCode: "00", Message: "Confirm Success" };
  }

  async getOccupiedSeats(date: string, timeSlot: string) {
    return await this.reservationRepo.findOccupiedSeats(date, timeSlot);
  }
}