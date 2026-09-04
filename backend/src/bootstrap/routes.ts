import { Router } from "express";
import { compositionRoot } from "@/bootstrap/composition-root";
import { createAuthMiddleware, requireAdmin } from "@/core/security/auth.middleware";
import { createAuthRoutes } from "@/modules/auth/presentation/http/auth.routes";
import { createUserRoutes, createAdminUserRoutes } from "@/modules/users/presentation/http/user.routes";
import { createCategoryRoutes } from "@/modules/categories/presentation/http/category.routes";
import { createProductRoutes } from "@/modules/products/presentation/http/product.routes";
import { createReviewRoutes } from "@/modules/reviews/presentation/http/review.routes";
import { createUploadRoutes } from "@/modules/uploads/presentation/http/upload.routes";
import { createStatsRoutes } from "@/modules/stats/presentation/http/stats.routes";
import { createReservationRoutes } from "@/modules/reservations/presentation/http/reservation.routes";
import { createPaymentSettingsRoutes } from "@/modules/payments/presentation/http/payment-settings.routes";
import { HttpResponse } from "@/core/http/response";

export function createRoutes() {
  const router = Router();
  const auth = createAuthMiddleware(compositionRoot.tokens);
  const admin = requireAdmin;
  router.get("/health", (_req, res) => HttpResponse.success(res, { status: "ok" }, "Service is healthy"));
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
