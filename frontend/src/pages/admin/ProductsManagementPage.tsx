import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/features/admin/admin.service";
import type {
  AdminCategory,
  AdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedResult,
} from "@/features/admin/admin.types";
import { showSuccess, showError } from "@/lib/toast";

type FormMode = "create" | "edit";

const EMPTY_FORM: CreateProductPayload = {
  name: "",
  price: 0,
  image: "",
  gallery: [],
  description: "",
  categoryId: "",
  isAvailable: true,
  stockQuantity: 0,
};

export const ProductsManagementPage = () => {
  const [result, setResult] = useState<PaginatedResult<AdminProduct> | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  
  // Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        adminService.getProducts(page, 10),
        adminService.getCategories(1, 100),
      ]);
      setResult(prodsData);
      setCategories(catsData.data);
    } catch {
      showError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setFormMode("create");
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setGalleryFiles([]);
    setModalOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setFormMode("edit");
    setEditTarget(product);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      gallery: product.gallery || [],
      description: product.description ?? "",
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
      stockQuantity: product.stockQuantity,
    });
    setImageFile(null);
    setGalleryFiles([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || (!form.image && !imageFile) || !form.categoryId) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Ảnh, Danh mục).");
      return;
    }
    setSaving(true);
    try {
      let finalImage = form.image;
      let finalGallery = form.gallery || [];

      if (imageFile) {
        finalImage = await adminService.uploadImage(imageFile);
      }

      if (galleryFiles.length > 0) {
        finalGallery = await adminService.uploadGallery(galleryFiles);
      }

      const payload = { ...form, image: finalImage, gallery: finalGallery };

      if (formMode === "create") {
        await adminService.createProduct(payload);
        showSuccess("Đã tạo sản phẩm thành công.");
      } else if (editTarget) {
        await adminService.updateProduct(editTarget.id, payload as UpdateProductPayload);
        showSuccess("Đã cập nhật sản phẩm thành công.");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      showError("Lỗi khi lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteProduct(confirmDelete.id);
      showSuccess(`Đã xóa "${confirmDelete.name}".`);
      setConfirmDelete(null);
      fetchData();
    } catch {
      showError("Không thể xóa sản phẩm.");
    } finally {
      setDeleting(false);
    }
  };

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const filtered = result?.data?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản lý Sản phẩm</h2>
          <p className="admin-page-subtitle">Tổng cộng {result?.total ?? 0} sản phẩm</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate} id="create-product-btn">
          + Thêm sản phẩm
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="🔍  Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={fetchData}>
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
            <div className="admin-empty__icon">🍣</div>
            <p className="admin-empty__text">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 12 }}>
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="admin-img-preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/40x40/1e293b/94a3b8?text=🍣";
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{p.slug}</div>
                    </td>
                    <td>{catName(p.categoryId)}</td>
                    <td style={{ fontWeight: 600, color: "var(--admin-accent)" }}>
                      {p.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td>{p.stockQuantity}</td>
                    <td>
                      <span className={`admin-badge ${p.isAvailable ? "admin-badge--green" : "admin-badge--gray"}`}>
                        {p.isAvailable ? "Có sẵn" : "Hết hàng"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          onClick={() => openEdit(p)}
                        >
                          ✏️
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setConfirmDelete(p)}
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

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Trước</button>
            <span style={{ display: "flex", alignItems: "center", fontSize: 13, color: "var(--admin-text-muted)" }}>Trang {page} / {result.totalPages}</span>
            <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))} disabled={page === result.totalPages}>Tiếp →</button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">
                {formMode === "create" ? "➕ Thêm sản phẩm mới" : "✏️ Chỉnh sửa sản phẩm"}
              </span>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="admin-modal__body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Tên sản phẩm *</label>
                  <input
                    className="admin-form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="VD: Cá hồi áp chảo"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Giá (VND) *</label>
                  <input
                    className="admin-form-input"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="89000"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tồn kho *</label>
                  <input
                    className="admin-form-input"
                    type="number"
                    min={0}
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                    placeholder="50"
                  />
                </div>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Ảnh chính (Tải lên hoặc nhập URL) *</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    <span>Hoặc URL:</span>
                    <input
                      className="admin-form-input"
                      style={{ flex: 1 }}
                      value={form.image || ""}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {(imageFile || form.image) && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                        alt="Preview"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Thư viện ảnh (Gallery - Tối đa 10 ảnh)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).slice(0, 10);
                        setGalleryFiles(files);
                      }
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {galleryFiles.length > 0 ? (
                      galleryFiles.map((file, i) => (
                        <img key={i} src={URL.createObjectURL(file)} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} alt="" />
                      ))
                    ) : (
                      form.gallery?.map((url, i) => (
                        <img key={i} src={url} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} alt="" />
                      ))
                    )}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Danh mục *</label>
                  <select
                    className="admin-form-select"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group" style={{ display: "flex", alignItems: "center" }}>
                  <label className="admin-form-label" style={{ marginBottom: 0 }}>&nbsp;</label>
                  <div className="admin-form-checkbox-row" style={{ marginTop: 28 }}>
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    />
                    <label htmlFor="isAvailable" style={{ fontSize: 14, color: "var(--admin-text-secondary)", cursor: "pointer" }}>
                      Còn hàng / Đang bán
                    </label>
                  </div>
                </div>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Mô tả</label>
                  <textarea
                    className="admin-form-textarea"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả ngắn về sản phẩm..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setModalOpen(false)}>Hủy</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : formMode === "create" ? "✓ Tạo sản phẩm" : "✓ Cập nhật"}
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
              <span className="admin-modal__title">⚠️ Xác nhận xóa</span>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="admin-modal__body">
              <p className="admin-confirm-text">
                Bạn có chắc muốn xóa sản phẩm <strong>"{confirmDelete.name}"</strong>? Hành động này không thể hoàn tác.
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
