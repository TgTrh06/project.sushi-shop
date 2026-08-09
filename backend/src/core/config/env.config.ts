import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvironmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  CORS_ORIGINS: z.string().optional(),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_USERNAME: z.string().min(2).max(30).default("admin"),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

export const env: Environment = EnvironmentSchema.parse({
  ...process.env,
  PORT: process.env.PORT ?? 5000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
});

export const allowedCorsOrigins = (env.CORS_ORIGINS ?? env.FRONTEND_URL)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
