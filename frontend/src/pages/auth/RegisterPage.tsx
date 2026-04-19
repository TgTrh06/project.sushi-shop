import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { RegisterSchema, type RegisterFormInput, type RegisterFormValues } from "@shared/schemas/auth.schema";
import { handleFormError } from "@/utils/errorHandler";
import { useAuthStore } from "@/stores/useAuthStore";

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
    <div className="auth__container">
      <div className="auth__card">
        {/* Header */}
        <div className="auth__header">
          <div className="auth__icon">🍣</div>
          <h1 className="auth__title">Create account</h1>
          <p className="auth__subtitle">Join us and enjoy fresh sushi</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="auth__form-group">
            <label className="auth__label">Full Name</label>
            <input
              {...register("username")}
              type="text"
              autoComplete="name"
              disabled={loading}
              placeholder="Nguyen Van A"
              className={`auth__input ${errors.username ? "auth__input--error" : ""}`}
            />
            {errors.username && (
              <span className="auth__error">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="auth__form-group">
            <label className="auth__label">Email</label>
            <input
              {...register("email")}
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
            <label className="auth__label">Password</label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              disabled={loading}
              placeholder="Min. 6 characters"
              className={`auth__input ${errors.password ? "auth__input--error" : ""}`}
            />
            {errors.password && (
              <span className="auth__error">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth__form-group">
            <label className="auth__label">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              autoComplete="new-password"
              disabled={loading}
              placeholder="Re-enter your password"
              className={`auth__input ${errors.confirmPassword ? "auth__input--error" : ""}`}
            />
            {errors.confirmPassword && (
              <span className="auth__error">{errors.confirmPassword.message}</span>
            )}
          </div>

          {errors.root && (
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <span className="auth__error">{errors.root.message}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="auth__button"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth__link" style={{ fontSize: "14px" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
