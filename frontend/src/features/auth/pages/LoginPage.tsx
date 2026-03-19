import { useState, type FormEvent } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { handleLogin, errors, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await handleLogin({
      email,
      password,
    });

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <main className="login-page">
      <h1>Log in</h1>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>

        {errors.message && <p className="error">{errors.message}</p>}
      </form>
    </main>
  );
}