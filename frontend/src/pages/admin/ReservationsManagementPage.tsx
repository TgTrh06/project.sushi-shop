import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { AdminReservation } from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";
import { Search, RefreshCw, Trash2, AlertTriangle } from "lucide-react";

const STATUS_OPTIONS = ["PENDING_PAYMENT", "PAID", "CANCELLED", "COMPLETED"] as const;

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const ReservationsManagementPage = () => {
  const [bookings, setBookings] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminReservation | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status update loading
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getReservations();
      setBookings(data);
    } catch {
      showError("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (booking: AdminReservation, newStatus: AdminReservation["status"]) => {
    setUpdatingId(booking.id);
    try {
      await adminService.updateReservationStatus(booking.id, newStatus);
      showSuccess("Reservation status updated successfully.");
      fetchBookings();
    } catch {
      showError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteReservation(confirmDelete.id);
      showSuccess("Reservation deleted successfully.");
      setConfirmDelete(null);
      fetchBookings();
    } catch {
      showError("Failed to delete reservation.");
    } finally {
      setDeleting(false);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "PENDING_PAYMENT").length;

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Reservations Management</h2>
          <p className="admin-page-subtitle">
            {bookings.length} total reservations
            {pendingCount > 0 && (
              <span style={{ color: "var(--admin-warning)", marginLeft: 8 }}>
                • {pendingCount} pending payment
              </span>
            )}
          </p>
        </div>
        <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchBookings}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)", pointerEvents: "none" }} />
            <input
              className="admin-search-input"
              placeholder="Search by name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                className={`admin-btn admin-btn--sm ${filterStatus === s ? "admin-btn--primary" : "admin-btn--secondary"}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === "all" ? "All" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📅</div>
            <p className="admin-empty__text">No reservations found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Session / Slot</th>
                  <th>Seats</th>
                  <th>Deposit</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, idx) => (
                  <tr key={b.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                    </td>
                    <td style={{ color: "var(--admin-text-secondary)" }}>{b.customerPhone}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.reservationDate}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, textTransform: "capitalize" }}>{b.session}</div>
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{b.slotId}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        {b.seatCodes.join(", ")}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {b.totalDeposit.toLocaleString("vi-VN")}₫
                    </td>
                    <td style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                      {b.vnp_TxnRef}
                    </td>
                    <td>
                      {updatingId === b.id ? (
                        <div className="admin-loading__spinner" style={{ width: 16, height: 16 }} />
                      ) : (
                        <select
                          className="admin-form-select"
                          style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b, e.target.value as AdminReservation["status"])}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {statusLabel[s]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setConfirmDelete(b)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title"><AlertTriangle size={16} /> Confirm Delete</span>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-confirm-text">
                Are you sure you want to delete the reservation for{" "}
                <strong>"{confirmDelete.customerName}"</strong> on{" "}
                <strong>{confirmDelete.reservationDate} ({confirmDelete.session} - {confirmDelete.slotId})</strong>?
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : <><Trash2 size={14} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
