import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LoginSchema, type LoginFormInput, type LoginFormValues } from "@shared/schemas/auth.schema";
import { handleFormError } from "@/utils/errorHandler";
import { useAuthStore } from "@/stores/useAuthStore";
import { Images } from "@/assets/image";

export const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login(data);
      // Redirect back to original page with state preservation
      const from = (location.state as any)?.from || "/";
      const bookingState = (location.state as any)?.bookingState;

      navigate(from, { state: { bookingState }, replace: true });
    } catch (error) {
      handleFormError(error, setError);
    }
  };

  return (
    <div className="auth__container">
      <div className="auth__card">
        {/* Header */}
        <div className="auth__header">
          <img className="auth__icon" src={Images.common.logo} alt="Logo" />
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="auth__form-group">
            <label className="auth__label">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              autoComplete="email"
              disabled={loading}
              placeholder="you@example.com"
              className={`auth__input ${errors.email ? "auth__input--error" : ""}`}
            />
            {errors.email && (
              <span className="auth__error">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth__form-group">
            <div className="auth__label">
              <span>Password</span>
              <Link to="/reset-password" className="auth__link">
                Forgot password?
              </Link>
            </div>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              disabled={loading}
              placeholder="••••••••"
              className={`auth__input ${errors.password ? "auth__input--error" : ""}`}
            />
            {errors.password && (
              <span className="auth__error">{errors.password.message}</span>
            )}
            {errors.root && (
              <span className="auth__error">{errors.root.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="auth__button"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth__footer">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth__link" style={{ fontSize: "14px" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};