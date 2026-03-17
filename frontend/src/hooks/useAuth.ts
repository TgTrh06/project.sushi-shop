import { useAuthStore } from "../stores/auth.store"
import { type LoginDTO, LoginSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { ZodError } from "zod";
import { useApi, type AppError } from "./useApi";
import { showError, showSuccess } from "../lib/toast";

export const useAuth = () => {
  const loginStore = useAuthStore((state) => state.login);
  const { errors, setErrors, loading, setLoading, handleError } = useApi();

  const handleLogin = async (dto: LoginDTO) => {

    setLoading(true);
    setErrors({});

    try {
      // Validate
      LoginSchema.parse(dto);

      // Call API
      const { token } = await authService.login(dto);
      
      // Save store
      await loginStore(token);

      showSuccess("Login Successful");
      
      return { success: true }
    } catch (error) {

      // ZOD
      if (error instanceof ZodError) {

        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((err) => {
          const field = err.path[0];
          if (field) {
            fieldErrors[field.toString()] = err.message;
          }
        });

        setErrors(fieldErrors);
        return { success: false };
      }

      // API error (Normalized from Interceptor)
      handleError(error as AppError);

      showError((error as AppError)?.message || "Login failed");

      return { success: false };
    } finally {
      setLoading(false)
    }
  };

  return { handleLogin, errors, loading };
}