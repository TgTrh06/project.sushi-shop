import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes";
import userRoutes from "../../modules/users/user.routes";
import categoryRoutes from "../../modules/categories/category.routes";
import productRoutes from "../../modules/products/product.routes";

const router = Router();

// Basic route to test if the server is running
router.get("/", (req, res) => {
  res.send("Welcome to the Sushi Shop API!");
});

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes)

export default router;