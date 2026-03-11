import express, { Request, Response } from "express";

import webRouter from "./routes";

import { globalErrorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(webRouter);

app.use(globalErrorHandler);

export default app;