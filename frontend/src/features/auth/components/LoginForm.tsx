import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "../auth.schema";
import { useAuthActions } from "../hooks/useAuth";
import { handleFormError } from "../../../utils/errorHandler";

export const LoginForm = () => {
  const { handleLogin, loading } = useAuthActions();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched", // Tối ưu: Chỉ validate khi người dùng blur khỏi input
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await handleLogin(data);
    } catch (error) {
      handleFormError(error, setError)
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            disabled={loading}
            className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {/* HIỂN THỊ LỖI TỪNG Ô (Zod hoặc Backend tự chui vào đây) */}
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            {...register("password")}
            type="password"
            disabled={loading}
            className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.root?.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};