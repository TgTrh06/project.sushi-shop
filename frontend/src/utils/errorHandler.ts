import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { showError } from "@/lib/toast";
import type { AppError } from "@/types/error.type";
import axios from "axios";

// Custom error messages for specific HTTP status codes
const ERROR_MESSAGES: Record<number, string> = {
  429: "Too many attempts. Please try again later.",
  500: "Server error. Please try again later.",
  503: "Service unavailable. Please try again later.",
};

export const handleFormError = <T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>
) => {
  const error = err as AppError;

  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // 1. Process field errors from server
    if (data?.errors && typeof data.errors === "object") {
      Object.keys(data.errors).forEach((field) => {
        setError(field as Path<T>, {
          type: "server",
          message: data.errors[field],
        });
      });
      return;
    }

    // 2. Show custom message for specific status codes
    if (status && ERROR_MESSAGES[status]) {
      showError(ERROR_MESSAGES[status]);
      return;
    }

    // 3. Show server message if available
    if (data?.message) {
      showError(data.message);
      return;
    }

    // 4. Fallback to generic message
    showError("An error occurred. Please try again.");
    return;
  }

  // Handle AppError type
  if (error.errors) {
    Object.keys(error.errors).forEach((field) => {
      setError(field as Path<T>, {
        type: "server",
        message: error.errors![field],
      });
    });
  } else if (error.message) {
    showError(error.message);
  } else {
    showError("An error occurred. Please try again.");
  }
};
