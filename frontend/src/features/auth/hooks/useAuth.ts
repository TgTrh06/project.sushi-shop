import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth.store";
import { authService } from "../auth.service";
import { Role } from "../../../config/constants/role";
import type { LoginInput, RegisterInput } from "../auth.schema";
import type { User } from "../../users/user.types";
import type { AppError } from "../../../types/error.type";
import { useState } from "react";
import { showSuccess } from "../../../lib/toast";

export const useAuthActions = () => {
  const { setUser, clearStore } = useAuthStore();
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSuccess = async (user: User) => {
    setUser(user);

    // Get to location before or Back to Home
    const from = location.state?.from?.pathname;

    if (from) {
      navigate(from, { replace: true });
    } else {
      // Default navigate
      if (user.role === Role.ADMIN) navigate("/admin/dashboard", { replace: true });
      else navigate("/shop", { replace: true });
    }
  }

  const handleRegister = async (input: RegisterInput) => {
    setLoading(true);

    try {
      const result = await authService.register(input);
      handleAuthSuccess(result.user);

      showSuccess("Register Successful");
      return { success: true };
    } catch (err) {
      const error = err as AppError;
      throw error; // Throw to Form Component
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (input: LoginInput) => {
    setLoading(true);

    try {
      const result = await authService.login(input);
      handleAuthSuccess(result.user);

      showSuccess("Login Successful");
      return { success: true };
    } catch (err) {
      const error = err as AppError;
      throw error; // Throw to Form Component
    } finally {
      setLoading(false)
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      const error = err as AppError;
      throw error; // Throw to Form Component
    } finally {
      clearStore();
      navigate("/login", { replace: true });
    }
  }

  return { 
    handleRegister,
    handleLogin, 
    handleLogout,
    loading 
  };
};