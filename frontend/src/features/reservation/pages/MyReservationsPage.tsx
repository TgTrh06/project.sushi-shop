import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { customerService } from "@/features/customer/customer.service";
import type { CustomerReservation } from "@/features/customer/customer.types";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import "@/assets/styles/pages/MyReservationsPage.css";

// Query key for TanStack Query
const MY_RESERVATIONS_QUERY_KEY = ["my-reservations"];

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  // ====== QUERY ======
  const {
    data: reservations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: MY_RESERVATIONS_QUERY_KEY,
    queryFn: () => customerService.getMyReservations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load reservations";
      toast.error(errorMessage);
    }
  }, [error, isError]);

  // ====== HELPER FUNCTIONS ======

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING_PAYMENT: {
        icon: AlertCircle,
        color: "#f59e0b",
        bg: "#fef3c7",
        label: "Chờ Thanh Toán",
      },
      PAID: {
        icon: CheckCircle,
        color: "#10b981",
        bg: "#d1fae5",
        label: "Đã Xác Nhận",
      },
      CANCELLED: {
        icon: XCircle,
        color: "#ef4444",
        bg: "#fee2e2",
        label: "Đã Hủy",
      },
      COMPLETED: {
        icon: CheckCircle,
        color: "#6366f1",
        bg: "#e0e7ff",
        label: "Hoàn Thành",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.PENDING_PAYMENT;
    const Icon = config.icon;

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (reservation: CustomerReservation) => {
    const reservationDate = new Date(reservation.reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      reservationDate >= today &&
      (reservation.status === "PAID" || reservation.status === "PENDING_PAYMENT")
    );
  };

  // ====== FILTERED DATA ======
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (filter === "upcoming") return isUpcoming(reservation);
      if (filter === "past")
        return (
          !isUpcoming(reservation) ||
          reservation.status === "COMPLETED" ||
          reservation.status === "CANCELLED"
        );
      return true;
    });
  }, [reservations, filter]);

  const upcomingCount = useMemo(
    () => reservations.filter(isUpcoming).length,
    [reservations]
  );
  const pastCount = useMemo(
    () =>
      reservations.filter(
        (r) => !isUpcoming(r) || r.status === "COMPLETED" || r.status === "CANCELLED"
      ).length,
    [reservations]
  );

  // ====== RENDER ======

  if (isLoading) {
    return (
      <div className="page-container reservations-page">
        <Breadcrumb items={[{ label: "Đặt Chỗ Của Tôi" }]} />
        <div className="reservations-page-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải đặt chỗ của bạn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container reservations-page">
      <Breadcrumb items={[{ label: "Đặt Chỗ Của Tôi" }]} />

      <div className="reservations-page-content">
        {/* HEADER CARD */}
        <section
          className="reservations-card reservations-header-card"
          data-aos="fade-up"
        >
          <div className="reservations-header__kanji">予</div>
          <div className="reservations-header__content">
            <h1 className="reservations-header__title">Đặt Chỗ Của Tôi</h1>
            <p className="reservations-header__subtitle">
              Xem và quản lý các trải nghiệm ăn uống Omakase của bạn. Mỗi đặt
              chỗ là một hành trình vào nghệ thuật ẩm thực Nhật Bản.
            </p>
            <button
              className="btn-elegant"
              onClick={() => navigate("/reservation")}
            >
              <Plus size={18} strokeWidth={2} />
              Đặt Chỗ Mới
            </button>
          </div>
        </section>

        {/* FILTERS & RESERVATIONS LIST */}
        {filteredReservations.length === 0 && reservations.length === 0 ? (
          <section
            className="reservations-card empty-state-card"
            data-aos="fade-up"
          >
            <div className="empty-state">
              <Calendar size={64} color="var(--text-muted)" strokeWidth={1} />
              <h3>Không tìm thấy đặt chỗ</h3>
              <p>
                Bạn chưa có đặt chỗ nào. Bắt đầu hành trình Omakase của bạn
                ngay hôm nay.
              </p>
              <button
                className="btn-elegant"
                onClick={() => navigate("/reservation")}
              >
                Đặt Chỗ Ngay
              </button>
            </div>
          </section>
        ) : (
          <section
            className="reservations-card reservations-main-card"
            data-aos="fade-up"
          >
            {/* Filters */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                Tất Cả
                <span className="filter-count">({reservations.length})</span>
              </button>
              <button
                className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                Sắp Tới
                <span className="filter-count">({upcomingCount})</span>
              </button>
              <button
                className={`filter-tab ${filter === "past" ? "active" : ""}`}
                onClick={() => setFilter("past")}
              >
                Quá Khứ
                <span className="filter-count">({pastCount})</span>
              </button>
            </div>

            {/* Divider */}
            <div className="section-divider"></div>

            {/* Reservations Grid */}
            {filteredReservations.length === 0 ? (
              <div className="empty-filter-state">
                <Calendar size={48} color="var(--text-muted)" strokeWidth={1} />
                <p>
                  Không tìm thấy đặt chỗ{" "}
                  {filter === "upcoming"
                    ? "sắp tới"
                    : filter === "past"
                      ? "quá khứ"
                      : ""}{" "}
                  nào.
                </p>
              </div>
            ) : (
              <div className="reservations-grid">
                {filteredReservations.map((reservation, index) => (
                  <div
                    key={reservation.id}
                    className="reservation-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    {/* Status Badge */}
                    <div className="reservation-item__header">
                      {getStatusBadge(reservation.status)}
                      <span className="transaction-ref">
                        #{reservation.vnp_TxnRef}
                      </span>
                    </div>

                    {/* Reservation Details */}
                    <div className="reservation-item__body">
                      <div className="detail-row">
                        <Calendar size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Ngày</span>
                          <span className="detail-value">
                            {formatDate(reservation.reservationDate)}
                          </span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <Clock size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Buổi & Giờ</span>
                          <span
                            className="detail-value"
                            style={{ textTransform: "capitalize" }}
                          >
                            {reservation.session} - {reservation.slotId}
                          </span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <Users size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Ghế</span>
                          <span className="detail-value">
                            {reservation.seatCodes.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <CreditCard size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Đặt Cọc</span>
                          <span className="detail-value">
                            {reservation.totalDeposit.toLocaleString("vi-VN")}{" "}
                            ₫
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="reservation-item__footer">
                      <span className="created-date">
                        Đặt vào {formatDate(reservation.createdAt)} lúc{" "}
                        {formatTime(reservation.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
