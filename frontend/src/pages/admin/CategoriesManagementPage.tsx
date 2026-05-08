import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { PaginatedResult } from "@/types/paginated.type";
import type {
  AdminCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";

type FormMode = "create" | "edit";

const EMPTY_FORM: CreateCategoryPayload = {
  name: "",
  description: "",
};

export const CategoriesManagementPage = () => {
  const [result, setResult] = useState<PaginatedResult<AdminCategory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CreateCategoryPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories(1, 100);
      setResult(data);
    } catch {
      showError("Không thể tải danh mục.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setFormMode("create");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setFormMode("edit");
    setEditTarget(cat);
    setForm({ name: cat.name, description: cat.description ?? "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showError("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (formMode === "create") {
        await adminService.createCategory(form);
        showSuccess("Category created successfully.");
      } else if (editTarget) {
        await adminService.updateCategory(editTarget.id, form as UpdateCategoryPayload);
        showSuccess("Category updated successfully.");
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      showError("Error occurred while saving the category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteCategory(confirmDelete.id);
      showSuccess(`Category deleted successfully: "${confirmDelete.name}".`);
      setConfirmDelete(null);
      fetchCategories();
    } catch {
      showError("Error occurred while deleting the category.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = result?.data?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Categories Management</h2>
          <p className="admin-page-subtitle">Total of {result?.total ?? 0} categories</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate} id="create-category-btn">
          Add Category
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="🔍 Search by category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchCategories}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🗂️</div>
            <p className="admin-empty__text">No categories found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, idx) => (
                  <tr key={cat.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                    <td>
                      <span className="admin-badge admin-badge--blue" style={{ fontFamily: "monospace" }}>
                        {cat.slug}
                      </span>
                    </td>
                    <td style={{ color: "var(--admin-text-secondary)", fontSize: 13 }}>
                      {cat.description ?? "—"}
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          onClick={() => openEdit(cat)}
                        >
                          ✏️
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setConfirmDelete(cat)}
                        >
                          🗑️
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">
                {formMode === "create" ? "➕ Add New Category" : "✏️ Edit Category"}
              </span>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-group">
                <label className="admin-form-label">Category Name *</label>
                <input
                  className="admin-form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Sushi cuộn"
                  autoFocus
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  className="admin-form-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the category..."
                  rows={3}
                />
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : formMode === "create" ? "Create Category" : "Update Category"}
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
              <span className="admin-modal__title">⚠️ Confirm Delete</span>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-confirm-text">
                Are you sure you want to delete the category <strong>"{confirmDelete.name}"</strong>? This action may affect related products.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
