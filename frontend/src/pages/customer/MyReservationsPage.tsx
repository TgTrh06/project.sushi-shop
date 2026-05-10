import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Users, CreditCard, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";
import { customerService } from "@/features/customer/customer.service";
import type { CustomerReservation } from "@/features/customer/customer.types";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import "../../assets/styles/pages/MyReservationsPage.css";

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await customerService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      console.error("Failed to fetch reservations:", error);
      toast.error(error.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING_PAYMENT: { icon: AlertCircle, color: "#f59e0b", bg: "#fef3c7", label: "Pending Payment" },
      PAID: { icon: CheckCircle, color: "#10b981", bg: "#d1fae5", label: "Confirmed" },
      CANCELLED: { icon: XCircle, color: "#ef4444", bg: "#fee2e2", label: "Cancelled" },
      COMPLETED: { icon: CheckCircle, color: "#6366f1", bg: "#e0e7ff", label: "Completed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_PAYMENT;
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
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (reservation: CustomerReservation) => {
    const reservationDate = new Date(reservation.reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate >= today && (reservation.status === "PAID" || reservation.status === "PENDING_PAYMENT");
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "upcoming") return isUpcoming(reservation);
    if (filter === "past") return !isUpcoming(reservation) || reservation.status === "COMPLETED" || reservation.status === "CANCELLED";
    return true;
  });

  if (loading) {
    return (
      <div className="page-container reservations-page">
        <Breadcrumb items={[{ label: "My Reservations" }]} />
        <div className="reservations-page-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container reservations-page">
      <Breadcrumb items={[{ label: "My Reservations" }]} />

      <div className="reservations-page-content">
        {/* HEADER CARD */}
        <section className="reservations-card reservations-header-card" data-aos="fade-up">
          <div className="reservations-header__kanji">予</div>
          <div className="reservations-header__content">
            <h1 className="reservations-header__title">My Reservations</h1>
            <p className="reservations-header__subtitle">
              View and manage your Omakase dining experiences. Each reservation is a journey into the art of Japanese cuisine.
            </p>
            <button className="btn-elegant" onClick={() => navigate("/reservation")}>
              <Plus size={18} strokeWidth={2} />
              New Reservation
            </button>
          </div>
        </section>

        {/* FILTERS & RESERVATIONS LIST */}
        {filteredReservations.length === 0 && reservations.length === 0 ? (
          <section className="reservations-card empty-state-card" data-aos="fade-up">
            <div className="empty-state">
              <Calendar size={64} color="var(--text-muted)" strokeWidth={1} />
              <h3>No reservations found</h3>
              <p>You haven't made any reservations yet. Start your Omakase journey today.</p>
              <button className="btn-elegant" onClick={() => navigate("/reservation")}>
                Make a Reservation
              </button>
            </div>
          </section>
        ) : (
          <section className="reservations-card reservations-main-card" data-aos="fade-up">
            {/* Filters */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Reservations
                <span className="filter-count">({reservations.length})</span>
              </button>
              <button
                className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
                <span className="filter-count">({reservations.filter(isUpcoming).length})</span>
              </button>
              <button
                className={`filter-tab ${filter === "past" ? "active" : ""}`}
                onClick={() => setFilter("past")}
              >
                Past
                <span className="filter-count">({reservations.filter((r) => !isUpcoming(r) || r.status === "COMPLETED" || r.status === "CANCELLED").length})</span>
              </button>
            </div>

            {/* Divider */}
            <div className="section-divider"></div>

            {/* Reservations Grid */}
            {filteredReservations.length === 0 ? (
              <div className="empty-filter-state">
                <Calendar size={48} color="var(--text-muted)" strokeWidth={1} />
                <p>No {filter} reservations found.</p>
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
                      <span className="transaction-ref">#{reservation.vnp_TxnRef}</span>
                    </div>

                    {/* Reservation Details */}
                    <div className="reservation-item__body">
                      <div className="detail-row">
                        <Calendar size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Date</span>
                          <span className="detail-value">{formatDate(reservation.reservationDate)}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <Clock size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Session & Time</span>
                          <span className="detail-value" style={{ textTransform: "capitalize" }}>
                            {reservation.session} - {reservation.slotId}
                          </span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <Users size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Seats</span>
                          <span className="detail-value">{reservation.seatCodes.join(", ")}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <CreditCard size={18} strokeWidth={1.5} />
                        <div>
                          <span className="detail-label">Deposit</span>
                          <span className="detail-value">{reservation.totalDeposit.toLocaleString("vi-VN")} ₫</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="reservation-item__footer">
                      <span className="created-date">
                        Booked on {formatDate(reservation.createdAt)} at {formatTime(reservation.createdAt)}
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
