import { Router } from "express";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";
import authRoutes from "@/modules/auth/auth.routes";
import adminRoutes from "@/modules/users/routes/admin.routes"
import userRoutes from "@/modules/users/routes/user.routes";
import categoryRoutes from "@/modules/categories/category.routes";
import productRoutes from "@/modules/products/product.routes";
import bookingRoutes from "@/modules/resevations/reservation.routes";
import { UserModel } from "@/modules/users/user.model";
import { ProductModel } from "@/modules/products/product.model";
import { CategoryModel } from "@/modules/categories/category.model";
import { ReservationModel } from "@/modules/resevations/reservation.model";

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
router.use("/reservation", bookingRoutes);

// Admin Stats endpoint
router.get("/admin/stats", verifyAuth, verifyAdmin, async (_req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalCategories, totalBookings, pendingBookings] =
      await Promise.all([
        UserModel.countDocuments({ role: "customer" }),
        ProductModel.countDocuments(),
        CategoryModel.countDocuments(),
        ReservationModel.countDocuments(),
        ReservationModel.countDocuments({ status: "pending" }),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalBookings,
        pendingBookings,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;