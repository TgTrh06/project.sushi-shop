import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tag,
  Users,
  CalendarDays,
  Star,
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
  { to: "/admin/products",   icon: UtensilsCrossed,  label: "Products" },
  { to: "/admin/categories", icon: Tag,              label: "Categories" },
  { to: "/admin/users",      icon: Users,            label: "Users" },
  { to: "/admin/resevations",icon: CalendarDays,     label: "Reservations" },
  { to: "/admin/reviews",    icon: Star,             label: "Reviews" },
];

export const AdminSidebar = ({ collapsed, onCollapse }: AdminSidebarProps) => {
  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-icon">
        </div>
        <div className="admin-sidebar__brand-text">
          <span className="admin-sidebar__brand-title">ItsuSushi Admin</span>
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
          title={collapsed ? "Back to Home" : undefined}
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
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="admin-sidebar__nav-icon">
            {collapsed
              ? <ChevronRight size={18} strokeWidth={1.75} />
              : <ChevronLeft  size={18} strokeWidth={1.75} />
            }
          </span>
          <span>{collapsed ? "" : "Collapse"}</span>
        </button>
      </div>
    </aside>
  );
};
