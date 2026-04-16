import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "@shared/schemas/auth.schema";

import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import MenuPage from "@/pages/MenuPage";
import ReservePage from "@/pages/customer/ReservePage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/reset-password" element={<ResetPasswordForm />} /> */}
      <Route path="/unauthorized" element={<h2>You don't have permission!</h2>} />

      {/* Shop / Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.ADMIN]} />}>
        <Route path="/reserve" element={<ReservePage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/admin/dashboard" element={<h2>Admin Dashboard</h2>} />
      </Route>

      {/* Redirect 404 */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};