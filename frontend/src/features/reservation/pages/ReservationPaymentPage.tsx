import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { confirmReservationPayment, getReservationPayment } from "../api/reservation.api";

export default function ReservationPaymentPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reservationId = params.get("reservationId");
  const [submitting, setSubmitting] = useState(false);
  const query = useQuery({
    queryKey: ["reservation-payment", reservationId],
    queryFn: () => getReservationPayment(reservationId!),
    enabled: Boolean(reservationId),
    refetchInterval: 15000,
  });
  const confirm = useMutation({
    mutationFn: () => confirmReservationPayment(reservationId!),
    onSuccess: () => { toast.success("Đã gửi yêu cầu duyệt thanh toán"); query.refetch(); },
    onError: () => toast.error("Không thể xác nhận thanh toán"),
    onSettled: () => setSubmitting(false),
  });

  if (!reservationId) return <div className="page-container"><p>Reservation không hợp lệ.</p></div>;
  if (query.isLoading) return <div className="page-container"><p>Đang tải thông tin thanh toán...</p></div>;
  if (query.isError || !query.data) return <div className="page-container"><p>Không thể tải thông tin thanh toán.</p></div>;

  const { reservation, payment } = query.data;
  const isPending = payment.status === "PENDING";
  const isApproval = payment.status === "PENDING_APPROVAL";
  const isPaid = payment.status === "CONFIRMED" || reservation.status === "PAID";

  return (
    <div className="page-container" style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Thanh toán đặt bàn</h1>
      <p>Mã giao dịch: <strong>{payment.transferContent}</strong></p>
      <div style={{ display: "grid", gap: 12, justifyItems: "center", padding: 24, border: "1px solid #ddd", borderRadius: 12 }}>
        <img src={payment.qrImageUrl} alt="VietQR thanh toán" style={{ width: 280, maxWidth: "100%" }} />
        <strong>{payment.amount.toLocaleString("vi-VN")} ₫</strong>
        <p>{payment.bankName} · {payment.accountNumber}</p>
        <p>{payment.accountName}</p>
        <p>Nội dung chuyển khoản: <strong>{payment.transferContent}</strong></p>
      </div>
      {isPending && (
        <button disabled={submitting} onClick={() => { setSubmitting(true); confirm.mutate(); }}>
          {submitting ? "Đang gửi..." : "Tôi đã thanh toán"}
        </button>
      )}
      {isApproval && <p>Thanh toán đã được gửi và đang chờ admin đối soát.</p>}
      {isPaid && <p>Thanh toán đã được xác nhận. Bàn của bạn đã được giữ.</p>}
      {payment.status === "REJECTED" && <p>Thanh toán bị từ chối. Vui lòng liên hệ nhà hàng.</p>}
      <button type="button" onClick={() => navigate("/my-reservations")}>Xem đặt bàn của tôi</button>
    </div>
  );
}
