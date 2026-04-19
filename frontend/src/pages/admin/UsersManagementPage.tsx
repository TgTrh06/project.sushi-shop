import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { AdminUser, PaginatedResult } from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";

export const UsersManagementPage = () => {
  const [result, setResult] = useState<PaginatedResult<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers(page, 10);
      setResult(data);
    } catch {
      showError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(confirmDelete.id);
      showSuccess(`Đã xóa người dùng "${confirmDelete.username}".`);
      setConfirmDelete(null);
      fetchUsers();
    } catch {
      showError("Không thể xóa người dùng.");
    } finally {
      setDeleting(false);
    }
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: "admin-badge--red",
      staff: "admin-badge--blue",
      customer: "admin-badge--green",
    };
    return <span className={`admin-badge ${map[role] ?? "admin-badge--gray"}`}>{role}</span>;
  };

  const filtered = result?.data?.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Người dùng</h2>
          <p className="admin-page-subtitle">
            Tổng cộng {result?.total ?? 0} người dùng
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="🔍  Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchUsers}>
            🔄 Làm mới
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Đang tải...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">👥</div>
            <p className="admin-empty__text">Không tìm thấy người dùng nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr key={user.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--admin-accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.username}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--admin-text-secondary)" }}>{user.email}</td>
                    <td>{roleBadge(user.role)}</td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setConfirmDelete(user)}
                        disabled={user.role === "admin"}
                        title={user.role === "admin" ? "Không thể xóa admin" : "Xóa người dùng"}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Trước
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: "var(--admin-text-muted)" }}>
              Trang {page} / {result.totalPages}
            </span>
            <button
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
              disabled={page === result.totalPages}
            >
              Tiếp →
            </button>
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
                Bạn có chắc muốn xóa người dùng{" "}
                <strong>"{confirmDelete.username}"</strong>? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>
                Hủy
              </button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Đang xóa..." : "🗑️ Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
