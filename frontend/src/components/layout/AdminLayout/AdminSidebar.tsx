import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

interface NavItem {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/admin/products", icon: "🍣", label: "Sản phẩm" },
  { to: "/admin/categories", icon: "🗂️", label: "Danh mục" },
  { to: "/admin/users", icon: "👥", label: "Người dùng" },
  { to: "/admin/bookings", icon: "📅", label: "Đặt bàn" },
];

export const AdminSidebar = ({ collapsed, onCollapse }: AdminSidebarProps) => {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-icon">🍱</div>
        <div className="admin-sidebar__brand-text">
          <span className="admin-sidebar__brand-title">Sushi Admin</span>
          <span className="admin-sidebar__brand-sub">Management Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        <span className="admin-sidebar__section-label">Menu</span>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `admin-sidebar__nav-item${isActive ? " active" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="admin-sidebar__nav-icon">{item.icon}</span>
            <span className="admin-sidebar__nav-label">{item.label}</span>
            {item.badge !== undefined && (
              <span className="admin-sidebar__nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div style={{ paddingTop: 16, borderTop: "1px solid var(--admin-border)", marginTop: 12 }} />

        <span className="admin-sidebar__section-label">Tài khoản</span>
        <NavLink
          to="/"
          className="admin-sidebar__nav-item"
          title={collapsed ? "Về trang chủ" : undefined}
        >
          <span className="admin-sidebar__nav-icon">🏠</span>
          <span className="admin-sidebar__nav-label">Trang chủ</span>
        </NavLink>
      </nav>

      {/* Footer / Collapse */}
      <div className="admin-sidebar__footer">
        <button
          className="admin-sidebar__collapse-btn"
          onClick={onCollapse}
          title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          <span className="admin-sidebar__nav-icon">
            {collapsed ? "→" : "←"}
          </span>
          <span>{collapsed ? "" : "Thu gọn"}</span>
        </button>
      </div>
    </aside>
  );
};
