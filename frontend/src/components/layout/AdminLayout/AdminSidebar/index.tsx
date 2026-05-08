import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Users,
  CalendarDays,
  Home,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import "./AdminSidebar.css";

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { to: "/admin/dashboard",  icon: LayoutDashboard,  label: "Dashboard" },
  { to: "/admin/products",   icon: UtensilsCrossed,  label: "Sản phẩm" },
  { to: "/admin/categories", icon: Tag,              label: "Danh mục" },
  { to: "/admin/users",      icon: Users,            label: "Người dùng" },
  { to: "/admin/bookings",   icon: CalendarDays,     label: "Đặt bàn" },
];

export const AdminSidebar = ({ collapsed, onCollapse }: AdminSidebarProps) => {
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

        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `admin-sidebar__nav-item${isActive ? " active" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <span className="admin-sidebar__nav-icon">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="admin-sidebar__nav-label">{label}</span>
            {badge !== undefined && (
              <span className="admin-sidebar__nav-badge">{badge}</span>
            )}
          </NavLink>
        ))}

        {/* Divider */}
        <div className="admin-sidebar__divider" />

        <span className="admin-sidebar__section-label">Navigate</span>
        <NavLink
          to="/"
          className="admin-sidebar__nav-item"
          title={collapsed ? "Về trang chủ" : undefined}
        >
          <span className="admin-sidebar__nav-icon">
            <Home size={18} strokeWidth={1.75} />
          </span>
          <span className="admin-sidebar__nav-label">Home</span>
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
            {collapsed
              ? <ChevronRight size={18} strokeWidth={1.75} />
              : <ChevronLeft  size={18} strokeWidth={1.75} />
            }
          </span>
          <span>{collapsed ? "" : "Thu gọn"}</span>
        </button>
      </div>
    </aside>
  );
};
