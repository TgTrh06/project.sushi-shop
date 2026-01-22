import express, { Request, Response } from "express";
import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Sushi Shop Backend is running!");
});

app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

export default app;