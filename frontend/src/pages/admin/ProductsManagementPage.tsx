import { useEffect, useState, useCallback, useMemo } from "react";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { adminService } from "@/features/admin/admin.service";
import { getImageUrl } from "@/lib/cloudinary";
import type { PaginatedResult } from "@/types/paginated.type";
import type {
  AdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/features/admin/admin.types";
import { Search, RefreshCw, Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";

type FormMode = "create" | "edit";

const EMPTY_FORM: CreateProductPayload = {
  name: "",
  price: 0,
  image_id: "",
  gallery_ids: [],
  categoryId: "",
  isAvailable: true,
};

export const ProductsManagementPage = () => {
  const { categories, fetchCategories, getCategoryName, refreshCategories } = useCategoryStore();

  const [result, setResult] = useState<PaginatedResult<AdminProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
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
      await Promise.all([
        adminService.getProducts(page, 10).then(setResult),
        fetchCategories(),
      ]);
    } catch {
      showError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [page, fetchCategories]);

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
      image_id: product.image_id,
      gallery_ids: product.gallery_ids || [],
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
    });
    setImageFile(null);
    setGalleryFiles([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || (!form.image_id && !imageFile) || !form.categoryId) {
      showError("Please fill in all required fields (Name, Image, Category).");
      return;
    }
    setSaving(true);
    try {
      let finalImageId: string | undefined = form.image_id;
      let finalGalleryIds = form.gallery_ids || [];

      if (imageFile) {
        const uploadResult = await adminService.uploadImage(imageFile);
        finalImageId = uploadResult.public_id;
      }

      if (galleryFiles.length > 0) {
        const uploadResult = await adminService.uploadGallery(galleryFiles);
        finalGalleryIds = uploadResult.public_ids;
      }

      const payload = { 
        ...form, 
        image_id: finalImageId,
        gallery_ids: finalGalleryIds
      };

      if (formMode === "create") {
        await adminService.createProduct(payload);
        showSuccess("Product created successfully.");
      } else if (editTarget) {
        await adminService.updateProduct(editTarget.id, payload as UpdateProductPayload);
        showSuccess("Product updated successfully.");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      showError("Error occurred while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteProduct(confirmDelete.id);
      showSuccess(`Product deleted successfully.`);
      setConfirmDelete(null);
      fetchData();
    } catch {
      showError("Error occurred while deleting the product.");
    } finally {
      setDeleting(false);
    }
  };
  
  const filtered = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return result?.data?.filter((p) => {
      const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
      
      const categoryName = getCategoryName(p.categoryId).toLowerCase();
      const matchesSearch = !searchTerm || (
        p.name.toLowerCase().includes(searchTerm) ||
        p.slug.toLowerCase().includes(searchTerm) ||
        categoryName.includes(searchTerm)
      );

      return matchesCategory && matchesSearch;
    }) ?? [];
  }, [result?.data, search, selectedCategory, getCategoryName]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Product Management</h2>
          <p className="admin-page-subtitle">Total of {result?.total ?? 0} products</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate} id="create-product-btn">
          Add Product
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--admin-text-muted)", pointerEvents: "none" }} />
            <input
              className="admin-search-input"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 32 }}
            />
          </div>
          <select
            className="admin-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button 
            className="admin-btn admin-btn--secondary admin-btn--sm" 
            onClick={async () => {
              await refreshCategories();
              fetchData();
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <span>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">🍣</div>
            <p className="admin-empty__text">No products found.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                        src={getImageUrl(p.image_id)}
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
                    <td>{getCategoryName(p.categoryId)}</td>
                    <td style={{ fontWeight: 600, color: "var(--admin-accent)" }}>
                      {p.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td>
                      <span className={`admin-badge ${p.isAvailable ? "admin-badge--green" : "admin-badge--gray"}`}>
                        {p.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          className="admin-btn admin-btn--warning admin-btn--sm"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setConfirmDelete(p)}
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
                {formMode === "create" ? <><Plus size={16} /> Add New Product</> : <><Pencil size={16} /> Edit Product</>}
              </span>
              <button className="admin-modal__close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="admin-modal__body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Product Name *</label>
                  <input
                    className="admin-form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E.g., Salmon Teriyaki"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Price (VND) *</label>
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
                  <label className="admin-form-label">Category *</label>
                  <select
                    className="admin-form-select"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">— Select Category —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Main Image (Upload or enter URL)</label>
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
                  </div>
                  {(imageFile || form.image_id) && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : form.image_id}
                        alt="Preview"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-form-label">Image Gallery (Max 10 images)</label>
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
                      form.gallery_ids?.map((url, i) => (
                        <img key={i} src={url} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} alt="" />
                      ))
                    )}
                  </div>
                </div>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <div className="admin-form-checkbox-row">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    />
                    <label htmlFor="isAvailable" style={{ fontSize: 14, color: "var(--admin-text-secondary)", cursor: "pointer" }}>
                      Is Available (Show on menu)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : formMode === "create" ? <><Plus size={14} /> Create Product</> : <><Pencil size={14} /> Update Product</>}
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
                Are you sure you want to delete the product <strong>"{confirmDelete.name}"</strong>? This action cannot be undone.
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
