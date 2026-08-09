import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/admin.service";
import type { PaymentSettings } from "@/features/admin/admin.types";
import { showError, showSuccess } from "@/lib/toast";

const emptySettings: PaymentSettings = { enabled: false, bankCode: "", bankName: "", accountNumber: "", accountName: "", qrTemplate: "compact2", paymentInstructions: "" };

export function PaymentSettingsPage() {
  const [form, setForm] = useState<PaymentSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { adminService.getPaymentSettings().then((value) => { if (value) setForm(value); }).catch(() => showError("Không thể tải cấu hình VietQR.")).finally(() => setLoading(false)); }, []);
  const update = (key: keyof PaymentSettings, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); try { await adminService.updatePaymentSettings(form); showSuccess("Đã lưu cấu hình VietQR."); } catch { showError("Không thể lưu cấu hình VietQR."); } finally { setSaving(false); } };
  if (loading) return <div className="admin-loading">Loading...</div>;
  return <div><div className="admin-page-header"><div><h2 className="admin-page-title">VietQR Payment Settings</h2><p className="admin-page-subtitle">Cấu hình tài khoản nhận tiền và hướng dẫn chuyển khoản.</p></div></div><form className="admin-card" onSubmit={save} style={{ maxWidth: 680, display: "grid", gap: 16 }}>
    <label className="admin-form-label"><input type="checkbox" checked={form.enabled} onChange={(e) => update("enabled", e.target.checked)} /> Bật thanh toán VietQR</label>
    {(["bankCode", "bankName", "accountNumber", "accountName", "qrTemplate"] as const).map((key) => <label key={key} className="admin-form-label">{key}<input className="admin-form-input" value={form[key]} onChange={(e) => update(key, e.target.value)} required={key !== "qrTemplate"} /></label>)}
    <label className="admin-form-label">Hướng dẫn chuyển khoản<textarea className="admin-form-input" rows={4} value={form.paymentInstructions} onChange={(e) => update("paymentInstructions", e.target.value)} /></label>
    <button className="admin-btn admin-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</button>
  </form></div>;
}
