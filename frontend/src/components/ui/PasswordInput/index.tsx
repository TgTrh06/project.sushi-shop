import { useState } from "react";
import { Icon } from "@/assets/svg";
import "./PasswordInput.css";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  autoComplete?: string;
}

export const PasswordInput = ({
  value,
  onChange,
  placeholder = "••••••••",
  disabled = false,
  error = false,
  autoComplete = "current-password",
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`password-input-wrapper ${error ? "password-input-wrapper--error" : ""}`}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="password-input__field"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="password-input__toggle"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <img
          src={showPassword ? Icon.eyeOpen : Icon.eyeClosed}
          alt={showPassword ? "Hide" : "Show"}
          className="password-input__icon"
        />
      </button>
    </div>
  );
};
