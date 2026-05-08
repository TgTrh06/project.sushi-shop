import React, { useState } from "react";
import { User, IdCard, Shield, Copy, Pencil, X, Check, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { userService } from "@/features/users/user.service";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { showSuccess, showError } from "@/lib/toast";
import {
  ChangePasswordSchema,
  type ChangePasswordFormInput,
} from "@shared/schemas/user.schema";

type TabType = "overview" | "personal" | "security";

// ── Inline edit field ──────────────────────────────────────────────────────
interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (val: string) => Promise<void>;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label, value, onSave, type = "text", placeholder, disabled = false,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className="fieldRow">
      <div className="fieldLabel">{label}</div>
      {editing ? (
        <input
          className="profile-form-input"
          style={{ flex: "0 1 200px", margin: "0 12px" }}
          type={type}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          disabled={saving}
        />
      ) : (
        <div className="fieldValue">{value || <span style={{ color: "var(--text-subtle)" }}>Not set</span>}</div>
      )}
      {!disabled && (
        editing ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fieldEditBtn fieldEditBtn--confirm" onClick={handleSave} disabled={saving}>
              <Check size={16} />
            </button>
            <button className="fieldEditBtn fieldEditBtn--cancel" onClick={handleCancel}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <button className="fieldEditBtn fieldEditBtn--edit" onClick={() => { setDraft(value); setEditing(true); }}>
            <Pencil size={15} />
            <span>Update</span>
          </button>
        )
      )}
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const { user, updateUser } = useAuthStore();

  // ── Change password form ──
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSaving },
    reset: resetPwd,
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    showSuccess("ID copied to clipboard");
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name[0]}****${name.slice(-2)}@${domain}`;
  };

  const formatDate = (d?: Date) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Never";

  // ── Save handlers ──
  const onSavePassword = handlePwd(async (data) => {
    try {
      await userService.changePassword(data);
      showSuccess("Password changed successfully");
      resetPwd();
      setPwdModalOpen(false);
    } catch {
      showError("Failed to change password. Check your current password.");
    }
  });

  // ── Quick inline save for single fields ──
  const saveUsername = async (val: string) => {
    const updated = await userService.updateProfile({ username: val });
    updateUser(updated);
    showSuccess("Username updated");
  };

  const savePhone = async (val: string) => {
    const num = Number(val);
    if (val && isNaN(num)) { showError("Phone number must be numeric"); throw new Error(); }
    const updated = await userService.updateProfile({ phoneNumber: val ? num : undefined });
    updateUser(updated);
    showSuccess("Phone number updated");
  };

  // ── Render sections ──
  const renderSidebar = () => (
    <aside className="sidebar">
      <nav className="sidebarNav">
        {(["overview", "personal", "security"] as TabType[]).map((tab) => {
          const icons = { overview: <User size={20} />, personal: <IdCard size={20} />, security: <Shield size={20} /> };
          const labels = { overview: "Account Overview", personal: "Personal Information", security: "Security" };
          return (
            <div
              key={tab}
              className={`navItem ${activeTab === tab ? "navItemActive" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {icons[tab]}
              <span>{labels[tab]}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );

  const renderPersonalInfo = () => (
    <div className="card">
      <div className="cardHeader">
        <h3 className="sectionTitle">Personal Information</h3>
        <div className="idBadge" onClick={handleCopyId} title="Click to copy ID">
          <span>ID: {user?.id ?? "—"}</span>
          <Copy size={14} />
        </div>
      </div>

      <EditableField
        label="Username"
        value={user?.username ?? ""}
        onSave={saveUsername}
        placeholder="Enter username"
      />
      <div className="fieldRow">
        <div className="fieldLabel">Email Address</div>
        <div className="fieldValue">{user?.email ? maskEmail(user.email) : "—"}</div>
        <span className="fieldLabel" style={{ fontSize: "var(--fs-label-sm)" }}>Contact support to change</span>
      </div>
      <EditableField
        label="Phone Number"
        value={user?.phoneNumber ? String(user.phoneNumber) : ""}
        onSave={savePhone}
        type="tel"
        placeholder="e.g. 84901234567"
      />
    </div>
  );

  const renderSecurity = () => (
    <div className="card">
      <h3 className="sectionTitle">Security</h3>

      {/* Password row — last updated on left, button on right */}
      <div className="fieldRow">
        <div className="fieldLabel">Password</div>
        <div className="fieldValue">
          Last updated: {formatDate(user?.passwordLastUpdated)}
        </div>
        <button
          className="fieldEditBtn fieldEditBtn--edit"
          onClick={() => { resetPwd(); setPwdModalOpen(true); }}
        >
          <KeyRound size={15} />
          <span>Change Password</span>
        </button>
      </div>

      {/* Change password modal */}
      {pwdModalOpen && (
        <div className="pwdModal-overlay" onClick={() => setPwdModalOpen(false)}>
          <div className="pwdModal" onClick={(e) => e.stopPropagation()}>
            <div className="pwdModal__header">
              <h3 className="pwdModal__title">Change Password</h3>
              <button className="pwdModal__close" onClick={() => setPwdModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSavePassword} className="pwdModal__body">
              {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
                const labels = {
                  currentPassword: "Current Password",
                  newPassword: "New Password",
                  confirmPassword: "Confirm New Password",
                };
                return (
                  <div key={field} className="profile-form-group">
                    <label className="profile-form-label">{labels[field]}</label>
                    <input
                      {...regPwd(field)}
                      type="password"
                      className={`profile-form-input ${pwdErrors[field] ? "profile-form-input--error" : ""}`}
                      placeholder="••••••••"
                      disabled={pwdSaving}
                      autoFocus={field === "currentPassword"}
                    />
                    {pwdErrors[field] && (
                      <span className="auth__error">{pwdErrors[field]?.message}</span>
                    )}
                  </div>
                );
              })}

              <div className="pwdModal__footer">
                <button
                  type="button"
                  className="fieldEditBtn fieldEditBtn--cancel"
                  onClick={() => setPwdModalOpen(false)}
                  disabled={pwdSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-btn-submit"
                  disabled={pwdSaving}
                >
                  {pwdSaving ? "Saving..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "personal": return renderPersonalInfo();
      case "security": return renderSecurity();
      default: return <>{renderPersonalInfo()}{renderSecurity()}</>;
    }
  };

  return (
    <div className="page-container profile-page">
      <Breadcrumb items={[{ label: "Profile" }]} />

      <div className="profile-page-content">
        <div className="layout">
          {renderSidebar()}
          <main className="contentArea">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
