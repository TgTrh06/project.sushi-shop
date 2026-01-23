import express, { Request, Response } from "express";

import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Sushi Shop Backend is running!");
});

app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);

export default app;