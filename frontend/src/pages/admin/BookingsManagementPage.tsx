import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { AdminBooking, BookingStatus } from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "cancelled"];

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    pending: "admin-badge--amber",
    confirmed: "admin-badge--green",
    cancelled: "admin-badge--gray",
  };
  return map[status] ?? "admin-badge--gray";
};

const statusLabel: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

export const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status update loading
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getBookings();
      setBookings(data);
    } catch {
      showError("Không thể tải danh sách đặt bàn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (booking: AdminBooking, newStatus: BookingStatus) => {
    setUpdatingId(booking._id);
    try {
      await adminService.updateBookingStatus(booking._id, newStatus);
      showSuccess("Đã cập nhật trạng thái đặt bàn.");
      fetchBookings();
    } catch {
      showError("Không thể cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteBooking(confirmDelete._id);
      showSuccess("Đã xóa đặt bàn.");
      setConfirmDelete(null);
      fetchBookings();
    } catch {
      showError("Không thể xóa đặt bàn.");
    } finally {
      setDeleting(false);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Đặt bàn</h2>
          <p className="admin-page-subtitle">
            {bookings.length} đặt bàn tổng cộng
            {pendingCount > 0 && (
              <span style={{ color: "var(--admin-warning)", marginLeft: 8 }}>
                • {pendingCount} chờ xác nhận
              </span>
            )}
          </p>
        </div>
        <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchBookings}>
          🔄 Làm mới
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="🔍  Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                className={`admin-btn admin-btn--sm ${filterStatus === s ? "admin-btn--primary" : "admin-btn--secondary"}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === "all" ? "Tất cả" : statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Đang tải...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📅</div>
            <p className="admin-empty__text">Không có đặt bàn nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Ngày / Giờ</th>
                  <th>Số người</th>
                  <th>Ghi chú</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, idx) => (
                  <tr key={b._id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{b.email}</div>
                    </td>
                    <td style={{ color: "var(--admin-text-secondary)" }}>{b.phone}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.date}</div>
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>{b.time}</div>
                    </td>
                    <td>{b.guests} người</td>
                    <td style={{ fontSize: 13, color: "var(--admin-text-secondary)", maxWidth: 150 }}>
                      {b.note || "—"}
                    </td>
                    <td>
                      {updatingId === b._id ? (
                        <div className="admin-loading__spinner" style={{ width: 16, height: 16 }} />
                      ) : (
                        <select
                          className="admin-form-select"
                          style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {statusLabel[s]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setConfirmDelete(b)}
                      >
                        🗑️
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
              <span className="admin-modal__title">⚠️ Xác nhận xóa</span>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-confirm-text">
                Bạn có chắc muốn xóa đặt bàn của{" "}
                <strong>"{confirmDelete.customerName}"</strong> vào ngày{" "}
                <strong>{confirmDelete.date} {confirmDelete.time}</strong>?
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Đang xóa..." : "🗑️ Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
