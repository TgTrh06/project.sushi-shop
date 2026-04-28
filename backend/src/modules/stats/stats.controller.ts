import { Request, Response, NextFunction } from "express";
import { UserModel } from "@/modules/users/user.model";
import { ProductModel } from "@/modules/products/product.model";
import { CategoryModel } from "@/modules/categories/category.model";
import { ReservationModel } from "@/modules/resevations/reservation.model";
import type { SystemStats } from "@shared/schemas/stats.schema";

export default class StatsController {
  /**
   * GET /api/v1/admin/stats
   * Protected by verifyAuth + verifyAdmin
   */
  getSystemStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

      const [
        totalUsers,
        newUsersLast30Days,
        totalProducts,
        activeProducts,
        productsByCategory,
        totalCategories,
        totalReservations,
        pendingReservations,
        completedReservations,
        todayReservations,
      ] = await Promise.all([
        // Users
        UserModel.countDocuments({ role: "customer" }),
        UserModel.countDocuments({
          role: "customer",
          createdAt: { $gte: thirtyDaysAgo },
        }),

        // Products
        ProductModel.countDocuments(),
        ProductModel.countDocuments({ isAvailable: true }),

        // Products grouped by category
        ProductModel.aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$categoryId",
              categoryName: { $first: "$category.name" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),

        // Categories
        CategoryModel.countDocuments(),

        // Reservations
        ReservationModel.countDocuments(),
        ReservationModel.countDocuments({ status: "PENDING_PAYMENT" }),
        ReservationModel.countDocuments({ status: "COMPLETED" }),
        ReservationModel.countDocuments({ reservationDate: todayStr }),
      ]);

      const stats: SystemStats = {
        totalUsers,
        newUsersLast30Days,
        totalProducts,
        activeProducts,
        productsByCategory: productsByCategory.map((item: any) => ({
          categoryId: item._id?.toString() || "",
          categoryName: item.categoryName || "Uncategorized",
          count: item.count,
        })),
        totalCategories,
        totalReservations,
        pendingReservations,
        completedReservations,
        todayReservations,
      };

      res.json({
        success: true,
        message: "System stats retrieved successfully.",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
