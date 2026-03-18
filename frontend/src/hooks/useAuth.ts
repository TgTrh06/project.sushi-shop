import { useAuthStore } from "../stores/authStore";
import { type LoginInput, LoginSchema, type RegisterInput, RegisterSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { ZodError } from "zod";
import { useApi } from "./useApi";
import { showError, showSuccess } from "../lib/toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Role } from "../constants/role";
import type { AppError } from "../types/error.type";

export const useAuth = () => {
  const { setToken, logout } = useAuthStore();
  const { errors, setErrors, loading, setLoading, handleError } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to handle errors consistently
  const handleAuthError = (error: unknown): { success: false } => {
    // ZOD validation errors
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((i) => {
        const field = i.path[0];
        if (field) {
          fieldErrors[field.toString()] = i.message;
        }
      });
      setErrors(fieldErrors);
      return { success: false };
    }

    // API errors (normalized from interceptor)
    const apiError = error as AppError;
    handleError(apiError);
    showError(apiError.message || "Something went wrong");
    return { success: false };
  };

  const handleAuthSuccess = async (accessToken: string) => {
    // Decode token & Save to store (SYNC)
    setToken(accessToken);

    // Get to location before or Back to Home
    const from = location.state?.from?.pathname;
    const userRole = useAuthStore.getState().user?.role;

    if (from) {
      navigate(from, { replace: true });
    } else {
      // Default navigate
      if (userRole === Role.ADMIN) navigate("/admin/dashboard", { replace: true });
      else navigate("/shop", { replace: true });
    }
  }

  const handleRegister = async (input: RegisterInput) => {
    setLoading(true);
    setErrors({});

    try {
      // Validate
      RegisterSchema.parse(input);

      // Call API & Set Token
      const { token } = await authService.register(input);
      handleAuthSuccess(token);

      showSuccess("Register Successful");
      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (input: LoginInput) => {
    setLoading(true);
    setErrors({});

    try {
      LoginSchema.parse(input);

      const { token } = await authService.login(input);
      handleAuthSuccess(token);

      showSuccess("Login Successful");
      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false)
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return { 
    handleRegister,
    handleLogin, 
    handleLogout,
    errors, 
    loading 
  };
};