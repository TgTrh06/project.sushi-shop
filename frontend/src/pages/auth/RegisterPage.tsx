import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { RegisterSchema, type RegisterFormInput, type RegisterFormValues } from "@shared/schemas/auth.schema";
import { handleFormError } from "@/utils/errorHandler";
import { useAuthStore } from "@/stores/auth.store";

export const RegisterPage = () => {
  const signUp = useAuthStore((state) => state.signUp);
  const loading = useAuthStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer", // default role is customer, users cannot choose role during registration
    },
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await signUp(data);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/20 rounded-2xl mb-4">
              <span className="text-3xl">🍣</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Join us and enjoy fresh sushi</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                {...register("username")}
                type="text"
                autoComplete="name"
                disabled={loading}
                placeholder="Nguyen Van A"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 ${
                  errors.username ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                disabled={loading}
                placeholder="you@example.com"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 ${
                  errors.email ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                disabled={loading}
                placeholder="Min. 6 characters"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 ${
                  errors.password ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                disabled={loading}
                placeholder="Re-enter your password"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 ${
                  errors.confirmPassword ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-red-400 text-xs text-center">{errors.root.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
