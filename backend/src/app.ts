import cors from "cors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config/database.config";
import "./config/cloudinary.config"; // Initialize Cloudinary
import mainRouter from "./routes";
import { allowedCorsOrigins, env } from "@/core/config/env.config";


const PORT = env.PORT;

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: allowedCorsOrigins,
      credentials: true, // HttpOnly Cookies
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/api/v1", mainRouter);

  app.use(globalErrorHandler);
  return app;
}

const app = createApp();

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export default app;
