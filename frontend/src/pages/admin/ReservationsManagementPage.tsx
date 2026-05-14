import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { AdminReservation } from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";
import { Search, RefreshCw, Trash2, AlertTriangle, Eye, Edit2 } from "lucide-react";

const STATUS_OPTIONS = ["PENDING_PAYMENT", "PAID", "CANCELLED", "COMPLETED"] as const;

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING_PAYMENT: "admin-badge--amber",
    PAID: "admin-badge--green",
    CANCELLED: "admin-badge--red",
    COMPLETED: "admin-badge--blue",
  };
  
  return (
    <span className={`admin-badge ${map[status] ?? "admin-badge--red"}`}>
      {statusLabel[status] ?? status}
    </span>
  );
};

export const ReservationsManagementPage = () => {
  const [bookings, setBookings] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminReservation | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Detail/Edit modal
  const [selectedReservation, setSelectedReservation] = useState<AdminReservation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminReservation>>({});
  const [saving, setSaving] = useState(false);

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

  const handleViewDetail = async (booking: AdminReservation) => {
    try {
      const detail = await adminService.getReservationById(booking.id);
      setSelectedReservation(detail);
      setIsEditing(false);
    } catch {
      showError("Failed to load reservation details.");
    }
  };

  const handleEdit = () => {
    if (!selectedReservation) return;
    setEditForm({
      customerName: selectedReservation.customerName,
      customerPhone: selectedReservation.customerPhone,
      status: selectedReservation.status,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedReservation || !editForm.status) return;
    setSaving(true);
    try {
      await adminService.updateReservationStatus(selectedReservation.id, editForm.status);
      showSuccess("Reservation updated successfully.");
      setSelectedReservation(null);
      setIsEditing(false);
      fetchBookings();
    } catch {
      showError("Failed to update reservation.");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
    setIsEditing(false);
    setEditForm({});
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
                      {b.seatCodes.join(", ")}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {b.totalDeposit.toLocaleString("vi-VN")}₫
                    </td>
                    <td style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                      {b.vnp_TxnRef}
                    </td>
                    <td>
                      {statusBadge(b.status)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          onClick={() => handleViewDetail(b)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setConfirmDelete(b)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail/Edit Modal */}
      {selectedReservation && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">
                {isEditing ? <><Edit2 size={16} /> Edit Reservation</> : <><Eye size={16} /> Reservation Details</>}
              </span>
              <button className="admin-modal__close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="admin-modal__body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="admin-form-label">Customer Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editForm.customerName || ""}
                      onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Customer Phone</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editForm.customerPhone || ""}
                      onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-form-select"
                      value={editForm.status || ""}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as AdminReservation["status"] })}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px", fontSize: 14 }}>
                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Customer Name:</div>
                  <div>{selectedReservation.customerName}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Phone:</div>
                  <div>{selectedReservation.customerPhone}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Date:</div>
                  <div>{selectedReservation.reservationDate}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Session:</div>
                  <div style={{ textTransform: "capitalize" }}>{selectedReservation.session}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Time Slot:</div>
                  <div>{selectedReservation.slotId}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Seats:</div>
                  <div>{selectedReservation.seatCodes.join(", ")}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Deposit:</div>
                  <div style={{ fontWeight: 600, color: "var(--admin-success)" }}>
                    {selectedReservation.totalDeposit.toLocaleString("vi-VN")}₫
                  </div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Transaction ID:</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12 }}>{selectedReservation.vnp_TxnRef}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Status:</div>
                  <div>
                    <span className={`admin-badge ${
                      selectedReservation.status === "PENDING_PAYMENT" ? "admin-badge--amber" :
                      selectedReservation.status === "PAID" ? "admin-badge--green" :
                      selectedReservation.status === "CANCELLED" ? "admin-badge--red" :
                      "admin-badge--blue"
                    }`}>
                      {statusLabel[selectedReservation.status]}
                    </span>
                  </div>

                  {selectedReservation.userId && (
                    <>
                      <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>User ID:</div>
                      <div style={{ fontFamily: "monospace", fontSize: 12 }}>{selectedReservation.userId}</div>
                    </>
                  )}

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Created At:</div>
                  <div>{new Date(selectedReservation.createdAt).toLocaleString("vi-VN")}</div>

                  <div style={{ fontWeight: 600, color: "var(--admin-text-secondary)" }}>Updated At:</div>
                  <div>{new Date(selectedReservation.updatedAt).toLocaleString("vi-VN")}</div>
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              {isEditing ? (
                <>
                  <button className="admin-btn admin-btn--secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="admin-btn admin-btn--primary" onClick={handleSaveEdit} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button className="admin-btn admin-btn--secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                  <button className="admin-btn admin-btn--primary" onClick={handleEdit}>
                    <Edit2 size={14} /> Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
