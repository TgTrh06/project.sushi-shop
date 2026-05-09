import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { AdminReview } from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";
import { Search, RefreshCw, Trash2, Eye, Star, AlertTriangle } from "lucide-react";

type SortOrder = "asc" | "desc";

const StarDisplay = ({ rating }: { rating: number }) => (
  <span style={{ display: "inline-flex", gap: 1, color: "#f59e0b" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={13} fill={s <= rating ? "#f59e0b" : "none"} strokeWidth={1.5} />
    ))}
  </span>
);

export const ReviewsManagementPage = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Detail popup
  const [detailReview, setDetailReview] = useState<AdminReview | null>(null);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminReview | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getReviews(
        page,
        10,
        emailFilter.trim() || undefined,
        dateFilter || undefined,
        sortOrder
      );
      setReviews(result.reviews);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      showError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, [page, emailFilter, dateFilter, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  const handleEmailChange = (v: string) => { setEmailFilter(v); setPage(1); };
  const handleDateChange = (v: string) => { setDateFilter(v); setPage(1); };
  const handleSortChange = (v: SortOrder) => { setSortOrder(v); setPage(1); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteReview(confirmDelete.id);
      showSuccess("Review deleted successfully.");
      setConfirmDelete(null);
      fetchData();
    } catch {
      showError("Error occurred while deleting the review.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncate = (text: string, max = 100) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Review Management</h2>
          <p className="admin-page-subtitle">Total of {total} reviews</p>
        </div>
        <button
          className="admin-btn admin-btn--secondary admin-btn--sm"
          onClick={fetchData}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)", pointerEvents: "none" }} />
            <input
              className="admin-search-input"
              placeholder="Search by user email..."
              value={emailFilter}
              onChange={(e) => handleEmailChange(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>
          <input
            className="admin-form-input"
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{ maxWidth: 180 }}
            title="Filter by date"
          />
          {dateFilter && (
            <button
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => handleDateChange("")}
              title="Clear date filter"
            >
              ✕ Clear date
            </button>
          )}
          <select
            className="admin-select"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value as SortOrder)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">⭐</div>
            <p className="admin-empty__text">No reviews found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Email</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, idx) => (
                  <tr key={r.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.user.email || "—"}</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
                        {r.user.name}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{r.product.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                        {r.product.slug}
                      </div>
                    </td>
                    <td>
                      <StarDisplay rating={r.rating} />
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
                        {r.rating}/5
                      </div>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <span style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                        {truncate(r.comment)}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12, color: "var(--admin-text-muted)" }}>
                      {formatDate(r.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          className="admin-btn admin-btn--info admin-btn--sm"
                          onClick={() => setDetailReview(r)}
                          title="View detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setConfirmDelete(r)}
                          title="Delete review"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: "var(--admin-text-muted)" }}>
              Page {page} / {totalPages}
            </span>
            <button
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailReview && (
        <div className="admin-modal-overlay" onClick={() => setDetailReview(null)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title"><Star size={16} /> Review Detail</span>
              <button className="admin-modal__close" onClick={() => setDetailReview(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product</label>
                  <div style={{ fontSize: 14, color: "var(--admin-text-primary)", fontWeight: 500 }}>
                    {detailReview.product.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                    {detailReview.product.slug}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">User</label>
                  <div style={{ fontSize: 14, color: "var(--admin-text-primary)", fontWeight: 500 }}>
                    {detailReview.user.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                    {detailReview.user.email}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Rating</label>
                  <div>
                    <StarDisplay rating={detailReview.rating} />
                    <span style={{ marginLeft: 6, fontSize: 13, color: "var(--admin-text-muted)" }}>
                      {detailReview.rating} / 5
                    </span>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Date</label>
                  <div style={{ fontSize: 13, color: "var(--admin-text-secondary)" }}>
                    {formatDate(detailReview.createdAt)}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Product ID</label>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)", wordBreak: "break-all" }}>
                    {detailReview.productId}
                  </div>
                </div>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Full Review</label>
                  <div
                    style={{
                      background: "var(--admin-bg-secondary, #f8fafc)",
                      border: "1px solid var(--admin-border)",
                      borderRadius: 8,
                      padding: "12px 16px",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--admin-text-primary)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {detailReview.comment}
                  </div>
                </div>
                {detailReview.photo_ids && detailReview.photo_ids.length > 0 && (
                  <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className="admin-form-label">Photos ({detailReview.photo_ids.length})</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {detailReview.photo_ids.map((id, i) => (
                        <img
                          key={i}
                          src={`https://res.cloudinary.com/${id}`}
                          alt={`Review photo ${i + 1}`}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setDetailReview(null)}>
                Close
              </button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={() => {
                  setDetailReview(null);
                  setConfirmDelete(detailReview);
                }}
              >
                <Trash2 size={14} /> Delete this review
              </button>
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
                Are you sure you want to delete the review by{" "}
                <strong>"{confirmDelete.user.email || confirmDelete.user.name}"</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
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
