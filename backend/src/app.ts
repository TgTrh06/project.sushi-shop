import cors from "cors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { env } from "./config/env.config";
import { globalErrorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config/database.config";
import mainRouter from "./routes";
import "./config/cloudinary.config"; // Initialize Cloudinary

const PORT = env.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // HttpOnly Cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1", mainRouter);

app.use(globalErrorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});