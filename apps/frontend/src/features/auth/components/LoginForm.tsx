import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await handleLogin(data);
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/20 rounded-2xl mb-4">
              <span className="text-3xl">🍣</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                {...register("email", { required: "Email is required" })}
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs text-orange-400 hover:text-orange-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                disabled={loading}
                placeholder="••••••••"
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50 ${
                  errors.password ? "border-red-500" : "border-white/10"
                }`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
              {errors.root && (
                <p className="text-red-400 text-xs mt-1">{errors.root.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};