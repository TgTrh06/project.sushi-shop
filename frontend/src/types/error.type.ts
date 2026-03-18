export type AppError = {
  message: string;
  errors?: Record<string, string>;
  status?: number;
};