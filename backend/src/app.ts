import express, { Request, Response } from "express";
import categoryRouter from "./routes/category.routes";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Sushi Shop Backend is running!");
});

app.use("/api/categories", categoryRouter);

export default app;