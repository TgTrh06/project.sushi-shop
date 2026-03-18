import { useState } from "react";
import type { AppError } from "../types/error.type";

export const useApi = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleError = (error: AppError) => {
    if (error.errors) {
      setErrors(error.errors);
    } else {
      setErrors({ message: error.message });
    }
  };

  return { errors, setErrors, loading, setLoading, handleError };
};