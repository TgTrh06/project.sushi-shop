import React, { useState } from "react";
import {
  User,
  IdCard,
  Key,
  Shield,
  Copy,
  ChevronRight,
  Trash2,
  ExternalLink,
  Smartphone
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "react-router-dom";

type TabType = "overview" | "personal" | "security";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { user } = useAuthStore();

  // Mock data for missing fields
  const profileData = {
    username: user?.username || "JohnDoe",
    email: user?.email || "j.****@example.com",
    mobile: "+1 (555) 000-0000",
    id: user?.id || "409438254",
    passwordLastUpdated: "April 12, 2026",
    trustedDevices: 2
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name[0]}.****${name.slice(-2)}@${domain}`;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(profileData.id);
    // Optional: show a toast notification
  };

  const renderBreadcrumb = () => (
    <div className="breadcrumb">
      <div className="breadcrumbPill">
        <Link to="/" className="breadcrumbItem">Home</Link>
        <ChevronRight size={14} className="breadcrumbSeparator" />
        <span className="breadcrumbActive">Profile</span>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <nav className="sidebarNav">
        <div
          className={`navItem ${activeTab === "overview" ? "navItemActive" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <User size={20} />
          <span>Account Overview</span>
        </div>
        <div
          className={`navItem ${activeTab === "personal" ? "navItemActive" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          <IdCard size={20} />
          <span>Personal Information</span>
        </div>
        <div
          className={`navItem ${activeTab === "security" ? "navItemActive" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={20} />
          <span>Password and Security</span>
        </div>
      </nav>
    </aside>
  );

  const renderPersonalInfo = () => (
    <div className="card">
      <h3 className="sectionTitle">Personal Information</h3>
      <div className="fieldRow">
        <div className="fieldLabel">Username</div>
        <div className="fieldValue">{profileData.username}</div>
        <button className="manageLink">Update</button>
      </div>
      <div className="fieldRow">
        <div className="fieldLabel">Email Address</div>
        <div className="fieldValue">{maskEmail(profileData.email)}</div>
        <button className="manageLink">Manage</button>
      </div>
      <div className="fieldRow">
        <div className="fieldLabel">Mobile Number</div>
        <div className="fieldValue">{profileData.mobile}</div>
        <button className="manageLink">Update</button>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="card">
      <h3 className="sectionTitle">Password & Security</h3>
      <div className="fieldRow">
        <div className="fieldLabel">Password</div>
        <div className="fieldValue">Last updated {profileData.passwordLastUpdated}</div>
        <button className="manageLink">Change Password</button>
      </div>
      <div className="fieldRow">
        <div className="fieldLabel">Trusted Devices</div>
        <div className="fieldValue">{profileData.trustedDevices} Devices connected</div>
        <button className="manageLink">Review</button>
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="card dangerZone">
      <h3 className="sectionTitle dangerTitle">Danger Zone</h3>
      <div className="warningBox">
        Deleting your account is permanent and cannot be undone. All your order history and rewards will be lost.
      </div>
      <div className="fieldRow">
        <div className="fieldLabel">Delete Account</div>
        <button className="dangerLink">Request to Delete</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalInfo();
      case "security":
        return renderSecurity();
      default:
        return (
          <>
            {renderPersonalInfo()}
            {renderSecurity()}
            {renderDangerZone()}
          </>
        );
    }
  };

  return (
    <div className="profileContainer">
      {renderBreadcrumb()}

      <div className="layout">
        {renderSidebar()}

        <main className="contentArea">
          <header className="header">
            <h1 className="title">Account Center</h1>
            <div className="idBadge" onClick={handleCopyId} title="Click to copy ID">
              <span>ID: {profileData.id}</span>
              <Copy size={14} />
            </div>
          </header>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
