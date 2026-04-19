import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Quản lý Sản phẩm",
  "/admin/categories": "Quản lý Danh mục",
  "/admin/users": "Quản lý Người dùng",
  "/admin/bookings": "Quản lý Đặt bàn",
};

export const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const currentTitle = pageTitles[location.pathname] ?? "Admin";
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "AD";

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <div>
          <h1 className="admin-header__title">{currentTitle}</h1>
          <div className="admin-header__breadcrumb">
            <span>Admin</span>
            <span>›</span>
            <span>{currentTitle}</span>
          </div>
        </div>
      </div>

      <div className="admin-header__right">
        <div className="admin-header__user">
          <div className="admin-header__avatar">{initials}</div>
          <div className="admin-header__user-info">
            <span className="admin-header__username">
              {user?.username ?? "Admin"}
            </span>
            <span className="admin-header__role">{user?.role ?? "admin"}</span>
          </div>
        </div>

        <button
          className="admin-header__logout-btn"
          onClick={handleLogout}
          id="admin-logout-btn"
        >
          <span>⏻</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
