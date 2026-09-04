import { UserModel } from "@/modules/users/infrastructure/mongoose/user.model";
import { ProductModel } from "@/modules/products/infrastructure/mongoose/product.model";
import { CategoryModel } from "@/modules/categories/infrastructure/mongoose/category.model";
import { ReservationModel } from "@/modules/reservations/infrastructure/mongoose/reservation.model";
import type { StatsRepository, SystemStats } from "../../domain/ports/stats-repository.port";

export class MongooseStatsRepository implements StatsRepository {
  async getSystemStats(): Promise<SystemStats> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
    const [totalUsers, newUsersLast30Days, totalProducts, activeProducts, productsByCategory, totalCategories, totalReservations, pendingReservations, completedReservations, todayReservations] = await Promise.all([
      UserModel.countDocuments({ role: "customer" }), UserModel.countDocuments({ role: "customer", createdAt: { $gte: thirtyDaysAgo } }), ProductModel.countDocuments(), ProductModel.countDocuments({ isAvailable: true }),
      ProductModel.aggregate([{ $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } }, { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, { $group: { _id: "$categoryId", categoryName: { $first: "$category.name" }, count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      CategoryModel.countDocuments(), ReservationModel.countDocuments(), ReservationModel.countDocuments({ status: { $in: ["PENDING_PAYMENT", "PENDING_APPROVAL"] } }), ReservationModel.countDocuments({ status: "COMPLETED" }), ReservationModel.countDocuments({ reservationDate: today }),
    ]);
    return { totalUsers, newUsersLast30Days, totalProducts, activeProducts, productsByCategory: productsByCategory.map((item: any) => ({ categoryId: String(item._id ?? ""), categoryName: item.categoryName ?? "Uncategorized", count: item.count })), totalCategories, totalReservations, pendingReservations, completedReservations, todayReservations };
  }
}
