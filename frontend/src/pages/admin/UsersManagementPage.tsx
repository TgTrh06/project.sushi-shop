import { useEffect, useState, useCallback, useMemo } from "react";
import { adminService } from "@/features/admin/admin.service";
import { getImageUrl } from "@/lib/cloudinary";
import type { AdminUser } from "@/features/admin/admin.types";
import type { PaginatedResult } from "@/types/paginated.type";
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
      showError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // FILTER: useMemo to avoid filtering on every render, only when result.data or search changes
  const filteredUsers = useMemo(() => {
    if (!result?.data) return [];
    return result.data.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [result?.data, search]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(confirmDelete.id);
      showSuccess(`User "${confirmDelete.username}" deleted successfully.`);
      setConfirmDelete(null);
      fetchUsers();
    } catch {
      showError("Failed to delete user.");
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

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">User Management</h2>
          <p className="admin-page-subtitle">
            Total users: {result?.total ?? 0}
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="🔍  Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">👥</div>
            <p className="admin-empty__text">No users found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {user.avatar_id ? (
                          <img
                            src={getImageUrl(user.avatar_id)}
                            alt={user.username}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove("hidden");
                            }}
                          />
                        ) : null}
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
                          className="hidden"
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
                        title={user.role === "admin" ? "Cannot delete admin" : "Delete user"}
                      >
                        🗑️ Delete
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
              <span className="admin-modal__title">⚠️ Confirm Delete</span>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-confirm-text">
                Are you sure you want to delete user{" "}
                <strong>"{confirmDelete.username}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
