import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { allowedCorsOrigins, env } from "@/core/config/env.config";
import { connectDatabase } from "@/core/database/mongoose.connection";
import { errorMiddleware } from "@/core/http/error.middleware";
import { createRoutes } from "@/app/routes";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(cors({ origin: allowedCorsOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use("/api/v1", createRoutes());
  app.use(errorMiddleware);
  return app;
}

const app = createApp();
if (require.main === module) {
  connectDatabase().then(() => app.listen(env.PORT, () => console.log(`Server is running on port ${env.PORT}`))).catch(() => process.exitCode = 1);
}
export default app;
