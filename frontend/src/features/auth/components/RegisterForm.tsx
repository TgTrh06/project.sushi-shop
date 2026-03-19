import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "../auth.schema";
import { authService } from "../auth.service";
import { useApi } from "../../../hooks/useApi";
import { handleFormError } from "../../../utils/errorHandler";

export const RegisterForm = () => {
  const { loading, setLoading } = useApi();

  const {
    register,
    handleSubmit,
    setError, // <--- Lấy hàm này từ React Hook Form
    formState: { errors }, // errors này giờ chứa cả lỗi Zod lẫn lỗi Backend
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      await authService.register(data);
      // Xử lý thành công (chuyển hướng, báo toast, v.v.)
    } catch (error) {
      handleFormError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input {...register("email")} />
        {/* Render lỗi bình thường, không cần biết là Zod hay Server */}
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit" disabled={loading}>Register</button>
    </form>
  );
};