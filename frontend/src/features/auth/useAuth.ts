import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { authService } from "./auth.service";
import { Role } from "../../constants/role";
import type { LoginInput, RegisterInput, ResetPasswordInput } from "@shared/schemas/auth.schema";
import type { User } from "../users/user.types";
import type { AppError } from "../../types/error.type";
import { useState } from "react";
import { showError, showSuccess } from "../../lib/toast";

export const useAuthActions = () => {
  const { setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = async (accessToken: string, user: User) => {
    setAuth(accessToken, user);

    // Default navigate
    if (user.role === Role.ADMIN)
      navigate("/admin/dashboard", { replace: true });
    else navigate("/shop", { replace: true });
  };

  const handleRegister = async (input: RegisterInput) => {
    setLoading(true);

    try {
      const { accessToken, user } = await authService.register(input);
      handleAuthSuccess(accessToken, user);

      showSuccess("Register Successful");
      return { success: true };
    } catch (err) {
      const error = err as AppError;
      showError(error.message);
      throw error; // Throw to Form Component
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (input: LoginInput) => {
    setLoading(true);

    try {
      const { accessToken, user } = await authService.login(input);
      handleAuthSuccess(accessToken, user);

      showSuccess("Login Successful");
      return { success: true };
    } catch (err) {
      const error = err as AppError;
      showError(error.message);
      throw error; // Throw to Form Component
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      const error = err as AppError;
      showError(error.message);
      throw error;
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  const handleResetPassword = async (input: ResetPasswordInput) => {
    setLoading(true);
    try {
      await authService.resetPassword(input);
      showSuccess("Password reset successful. Please login.");
      navigate("/login", { replace: true });
      return { success: true };
    } catch (err) {
      const error = err as AppError;
      showError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    handleResetPassword,
    loading,
  };
};
