import { Router } from "express";
import { compositionRoot } from "@/composition-root";
import { createAuthMiddleware, requireAdmin } from "@/core/security/auth.middleware";
import { createAuthRoutes } from "@/modules/auth/presentation/routes/auth.routes";
import { createUserRoutes, createAdminUserRoutes } from "@/modules/users/presentation/routes/user.routes";
import { createCategoryRoutes } from "@/modules/categories/presentation/routes/category.routes";
import { createProductRoutes } from "@/modules/products/presentation/routes/product.routes";
import { createReviewRoutes } from "@/modules/reviews/presentation/routes/review.routes";
import { createUploadRoutes } from "@/modules/uploads/presentation/routes/upload.routes";
import { createStatsRoutes } from "@/modules/stats/presentation/routes/stats.routes";
import { createReservationRoutes } from "@/modules/reservations/presentation/routes/reservation.routes";
import { createPaymentSettingsRoutes } from "@/modules/payments/presentation/routes/payment-settings.routes";

export function createRoutes() {
  const router = Router();
  const auth = createAuthMiddleware(compositionRoot.tokens);
  const admin = requireAdmin;
  router.get("/", (_req, res) => res.send("Welcome to the Sushi Shop API!"));
  router.use("/auth", createAuthRoutes(compositionRoot.authController, compositionRoot.rateLimiters));
  router.use("/users", createUserRoutes(compositionRoot.userController, auth, admin));
  router.use("/admin/stats", createStatsRoutes(compositionRoot.statsController, auth, admin));
  router.use("/admin/payment-settings", createPaymentSettingsRoutes(compositionRoot.paymentSettingsController, auth, admin));
  router.use("/admin", createAdminUserRoutes(compositionRoot.userController, auth, admin));
  router.use("/categories", createCategoryRoutes(compositionRoot.categoryController, auth, admin));
  router.use("/products", createProductRoutes(compositionRoot.productController, auth, admin));
  router.use("/reviews", createReviewRoutes(compositionRoot.reviewController, auth, admin));
  router.use("/upload", createUploadRoutes(compositionRoot.uploadController, auth, admin));
  router.use("/reservations", createReservationRoutes(compositionRoot.reservationController, auth, admin, compositionRoot.rateLimiters.reservation));
  return router;
}
