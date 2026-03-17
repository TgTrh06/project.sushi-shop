import { useState } from "react";

type AppError = {
  message: string;
  errors?: Record<string, string>;
};

export const useApi = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const hanldeError = (error: AppError) => {
    if (error.errors) {
      setErrors(error.errors);
    } else {
      setErrors({ message: error.message });
    }
  };

  return {
    errors,
    setErrors,
    loading,
    setLoading,
    hanldeError,
  };
};