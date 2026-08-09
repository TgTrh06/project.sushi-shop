import { env } from "@/core/config/env.config";
import { REFRESH_TOKEN_EXPIRY } from "@/core/security/refresh-cookie";
import { MongooseUnitOfWork } from "@/core/transactions/mongoose-unit-of-work";
import { SystemClock } from "@/core/ports/clock.port";
import { UuidIdGenerator } from "@/core/ports/id-generator.port";
import { BcryptPasswordHasher } from "@/modules/auth/infrastructure/bcrypt-password-hasher";
import { JwtTokenService } from "@/modules/auth/infrastructure/jwt-token.service";
import { MongooseSessionRepository } from "@/modules/auth/infrastructure/persistence/mongoose/session.repository";
import { LoginUserUseCase } from "@/modules/auth/application/use-cases/login-user.use-case";
import { RegisterUserUseCase } from "@/modules/auth/application/use-cases/register-user.use-case";
import { RefreshSessionUseCase } from "@/modules/auth/application/use-cases/refresh-session.use-case";
import { LogoutUserUseCase } from "@/modules/auth/application/use-cases/logout-user.use-case";
import { AuthController } from "@/modules/auth/presentation/controllers/auth.controller";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/mongoose/user.repository";
import { GetUserUseCase } from "@/modules/users/application/use-cases/get-user.use-case";
import { UpdateProfileUseCase } from "@/modules/users/application/use-cases/update-profile.use-case";
import { ChangePasswordUseCase } from "@/modules/users/application/use-cases/change-password.use-case";
import { ListUsersUseCase } from "@/modules/users/application/use-cases/list-users.use-case";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/delete-user.use-case";
import { UserController } from "@/modules/users/presentation/controllers/user.controller";
import { MongooseCategoryRepository } from "@/modules/categories/infrastructure/persistence/mongoose/category.repository";
import { ListCategoriesUseCase, GetCategoryBySlugUseCase, CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase } from "@/modules/categories/application/use-cases/category.use-cases";
import { CategoryController } from "@/modules/categories/presentation/controllers/category.controller";
import { MongooseProductRepository } from "@/modules/products/infrastructure/persistence/mongoose/product.repository";
import { ListProductsUseCase, GetProductUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from "@/modules/products/application/use-cases/product.use-cases";
import { ProductController } from "@/modules/products/presentation/controllers/product.controller";
import { MongooseReviewRepository } from "@/modules/reviews/infrastructure/persistence/mongoose/review.repository";
import { CreateReviewUseCase, ListProductReviewsUseCase, ListAdminReviewsUseCase, DeleteReviewUseCase } from "@/modules/reviews/application/use-cases/review.use-cases";
import { ReviewController } from "@/modules/reviews/presentation/controllers/review.controller";
import { CloudinaryFileStorage } from "@/modules/uploads/infrastructure/cloudinary-file-storage";
import { UploadFileUseCase, DeleteFilesUseCase } from "@/modules/uploads/application/use-cases/upload-file.use-case";
import { UploadController } from "@/modules/uploads/presentation/controllers/upload.controller";
import { MongooseStatsRepository } from "@/modules/stats/infrastructure/persistence/mongoose/stats.repository";
import { GetSystemStatsUseCase } from "@/modules/stats/application/use-cases/get-system-stats.use-case";
import { StatsController } from "@/modules/stats/presentation/controllers/stats.controller";
import { MongooseReservationRepository } from "@/modules/reservations/infrastructure/persistence/mongoose/reservation.repository";
import { MongooseSeatHoldRepository } from "@/modules/reservations/infrastructure/persistence/mongoose/seat-hold.repository";
import { CreateReservationUseCase, GetOccupiedSeatsUseCase, GetMyReservationsUseCase, GetAdminReservationsUseCase, GetReservationPaymentUseCase, ConfirmCustomerPaymentUseCase, ApproveManualPaymentUseCase, RejectManualPaymentUseCase, UpdateReservationStatusUseCase, DeleteReservationUseCase } from "@/modules/reservations/application/use-cases/reservation.use-cases";
import { ReservationController } from "@/modules/reservations/presentation/controllers/reservation.controller";
import { MongoosePaymentSettingsRepository, MongooseReservationPaymentRepository } from "@/modules/payments/infrastructure/persistence/mongoose/payment.repository";
import { VietQrQuickLinkGenerator } from "@/modules/payments/infrastructure/vietqr-generator";
import { GetPaymentSettingsUseCase, ConfigurePaymentSettingsUseCase } from "@/modules/payments/application/use-cases/payment-settings.use-cases";
import { PaymentSettingsController } from "@/modules/payments/presentation/controllers/payment-settings.controller";
import { createMongoRateLimiter } from "@/core/security/mongo-rate-limit";

export function createCompositionRoot() {
  const users = new MongooseUserRepository();
  const sessions = new MongooseSessionRepository();
  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenService();
  const storage = new CloudinaryFileStorage();
  const categories = new MongooseCategoryRepository();
  const products = new MongooseProductRepository();
  const reviews = new MongooseReviewRepository();
  const reservations = new MongooseReservationRepository();
  const holds = new MongooseSeatHoldRepository();
  const settings = new MongoosePaymentSettingsRepository();
  const payments = new MongooseReservationPaymentRepository();
  const unitOfWork = new MongooseUnitOfWork();
  const clock = new SystemClock();
  const ids = new UuidIdGenerator();

  const authController = new AuthController(
    new RegisterUserUseCase(users, sessions, hasher, tokens, REFRESH_TOKEN_EXPIRY),
    new LoginUserUseCase(users, sessions, hasher, tokens, REFRESH_TOKEN_EXPIRY),
    new RefreshSessionUseCase(users, sessions, tokens, REFRESH_TOKEN_EXPIRY),
    new LogoutUserUseCase(sessions, tokens),
  );
  const userController = new UserController(new GetUserUseCase(users), new UpdateProfileUseCase(users, storage), new ChangePasswordUseCase(users, hasher), new ListUsersUseCase(users), new DeleteUserUseCase(users, storage));
  const categoryController = new CategoryController(new ListCategoriesUseCase(categories), new GetCategoryBySlugUseCase(categories), new CreateCategoryUseCase(categories), new UpdateCategoryUseCase(categories), new DeleteCategoryUseCase(categories));
  const productController = new ProductController(new ListProductsUseCase(products, categories), new GetProductUseCase(products), new CreateProductUseCase(products), new UpdateProductUseCase(products, storage), new DeleteProductUseCase(products, storage));
  const reviewController = new ReviewController(new CreateReviewUseCase(reviews, products), new ListProductReviewsUseCase(reviews), new ListAdminReviewsUseCase(reviews), new DeleteReviewUseCase(reviews, storage));
  const uploadController = new UploadController(new UploadFileUseCase(storage), new DeleteFilesUseCase(storage));
  const statsController = new StatsController(new GetSystemStatsUseCase(new MongooseStatsRepository()));
  const reservationController = new ReservationController(
    new CreateReservationUseCase(reservations, holds, payments, settings, new VietQrQuickLinkGenerator(), unitOfWork, clock, ids, env.FRONTEND_URL),
    new GetOccupiedSeatsUseCase(reservations, holds, clock),
    new GetMyReservationsUseCase(reservations),
    new GetAdminReservationsUseCase(reservations),
    new GetReservationPaymentUseCase(reservations, payments),
    new ConfirmCustomerPaymentUseCase(reservations, holds, payments, unitOfWork, clock),
    new ApproveManualPaymentUseCase(reservations, holds, payments, unitOfWork, clock),
    new RejectManualPaymentUseCase(reservations, holds, payments, unitOfWork, clock),
    new UpdateReservationStatusUseCase(reservations, holds, unitOfWork),
    new DeleteReservationUseCase(reservations, holds),
  );
  const paymentSettingsController = new PaymentSettingsController(new GetPaymentSettingsUseCase(settings), new ConfigurePaymentSettingsUseCase(settings));

  return {
    tokens,
    authController,
    userController,
    categoryController,
    productController,
    reviewController,
    uploadController,
    statsController,
    reservationController,
    paymentSettingsController,
    rateLimiters: {
      auth: createMongoRateLimiter("auth", 15 * 60_000, 20),
      refresh: createMongoRateLimiter("refresh", 15 * 60_000, 30),
      reservation: createMongoRateLimiter("reservation", 15 * 60_000, 10),
    },
  };
}

export const compositionRoot = createCompositionRoot();
