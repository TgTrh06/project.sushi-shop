import express from "express";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./middleware/error.middleware";

import webRouter from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(webRouter);

app.use(globalErrorHandler);

export default app;