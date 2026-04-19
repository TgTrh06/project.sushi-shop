import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import "./AdminLayout.css";

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-root${collapsed ? " sidebar-collapsed" : ""}`}>
      <AdminSidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed((prev) => !prev)}
      />
      <AdminHeader />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
