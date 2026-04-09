import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "@shared/schemas/auth.schema";

import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
// import { ResetPasswordForm } from "../features/auth/components/ResetPasswordForm";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import MenuPage from "../pages/MenuPage";
import BookingPage from "../pages/customer/BookingPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      {/* <Route path="/reset-password" element={<ResetPasswordForm />} /> */}
      <Route path="/unauthorized" element={<h2>You don't have permission!</h2>} />

      {/* Shop / Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.ADMIN]} />}>
        <Route path="/booking" element={<BookingPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/admin" element={<h2>Admin Dashboard</h2>} />
      </Route>

      {/* Redirect 404 */}
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );
};