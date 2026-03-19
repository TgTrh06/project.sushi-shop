import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./core/middleware/error.middleware";

import mainRouter from "./core/routes";

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

app.use("/api/v1", mainRouter);

app.use(globalErrorHandler);

export default app;