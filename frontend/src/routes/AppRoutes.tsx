import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "@shared/schemas/auth.schema";

// Public pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import MenuPage from "@/pages/MenuPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ReservePage from "@/pages/customer/ReservationPage";
import ProfilePage from "@/pages/customer/ProfilePage";

// Admin Layout & Pages
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardOverviewPage } from "@/pages/admin/DashboardOverviewPage";
import { UsersManagementPage } from "@/pages/admin/UsersManagementPage";
import { ProductsManagementPage } from "@/pages/admin/ProductsManagementPage";
import { CategoriesManagementPage } from "@/pages/admin/CategoriesManagementPage";
import { BookingsManagementPage } from "@/pages/admin/BookingsManagementPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/reservation" element={<ReservePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<h2 style={{ textAlign: "center", marginTop: 80, color: "#94a3b8" }}>🚫 Bạn không có quyền truy cập trang này!</h2>} />
      <Route path="/not-found" element={<h2 style={{ textAlign: "center", marginTop: 80, color: "#94a3b8" }}>404 — Không tìm thấy trang!</h2>} />

      {/* Redirect 404 */}
      <Route path="*" element={<Navigate to="/not-found" />} />

      {/* Shop / Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.ADMIN]} />}>
        {/* Add customer-only routes here */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ── Admin Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/admin/users" element={<UsersManagementPage />} />
          <Route path="/admin/products" element={<ProductsManagementPage />} />
          <Route path="/admin/categories" element={<CategoriesManagementPage />} />
          <Route path="/admin/bookings" element={<BookingsManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
};