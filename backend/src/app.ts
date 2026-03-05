import express, { Request, Response } from "express";

import webRouter from "./routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use(webRouter);

app.use(errorHandler);

export default app;