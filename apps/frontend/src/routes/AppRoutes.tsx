import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Role } from "../config/constants/role";

import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { ResetPasswordForm } from "../features/auth/components/ResetPasswordForm";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import MenuPage from "../pages/MenuPage";
import BookingPage from "../pages/BookingPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/unauthorized" element={<h2>You don't have permission!</h2>} />

      {/* Admin Routes (Chỉ Admin mới vào được) */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/admin" element={<h2>Admin Dashboard</h2>} />
      </Route>

      {/* Shop / Customer Routes (Bất kỳ ai đăng nhập đều vào được) */}
      {/* <Route element={<ProtectedRoute allowedRoles={[Role.CUSTOMER, Role.ADMIN]} />}> */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/booking" element={<BookingPage />} />
      {/* </Route> */}

      {/* Redirect 404 */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};