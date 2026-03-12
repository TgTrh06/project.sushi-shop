import { Router } from "express";
import Auth from "./auth.routes";
import UserRoute from "./user.routes";
import CategoryRoute from "./category.routes";
import ProductRoute from "./product.routes";

const router = Router();

// Basic route to test if the server is running
router.get("/", (req, res) => {
  res.send("Welcome to the Sushi Shop API!");
});

// API routes
router.use("/api/auth", Auth);
router.use("/api/users", UserRoute);
router.use("/api/categories", CategoryRoute);
router.use("/api/products", ProductRoute)

export default router;