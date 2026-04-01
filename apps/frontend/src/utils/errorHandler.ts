import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { AppError } from "../types/error.type";
import { showError } from "../lib/toast";

export const handleFormError = <T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>
) => {
  const error = err as AppError;

  // 1. Process error of each field (Field Errors)
  if (error.errors) {
    Object.keys(error.errors).forEach((field) => {
      setError(field as Path<T>, {
        type: "server",
        message: error.errors![field],
      });
    });
  }

  // 2. Process global error
  if (error.message && !error.errors) {
    showError(error.message);
  }
}