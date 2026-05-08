import { useLocation } from "react-router-dom";
import { UserMenu } from "@/components/layout/UserMenu";
import "./AdminHeader.css";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/users": "Users",
  "/admin/bookings": "Bookings",
};

export const AdminHeader = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] ?? "Admin";

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
        <UserMenu redirectOnLogout="/login" />
      </div>
    </header>
  );
};
