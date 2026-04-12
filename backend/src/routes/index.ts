import { Router } from "express";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import authRoutes from "@/modules/auth/auth.routes";
import adminRoutes from "@/modules/users/routes/admin.routes"
import userRoutes from "@/modules/users/routes/user.routes";
import categoryRoutes from "@/modules/categories/category.routes";
import productRoutes from "@/modules/products/product.routes";

const router = Router();

// Basic route to test if the server is running
router.get("/", (req, res) => {
  res.send("Welcome to the Sushi Shop API!");
});

// API routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
// router.use("/booking", bookingRoutes);

// Admin routes
router.get("/admin/menu", verifyAuth, verifyAdmin, (_req, res) => {
  res.json({ success: true, message: "Admin menu", data: [] });
});

export default router;