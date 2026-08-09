import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import SessionRepository from "@/modules/auth/session.repository";
import UserRepository from "@/modules/users/user.repository";
import UserController from "@/modules/users/user.controller";
import UserService from "@/modules/users/user.service";
import CategoryRepository from "@/modules/categories/category.repository";
import CategoryController from "@/modules/categories/category.controller";
import CategoryService from "@/modules/categories/category.service";
import ProductRepository from "@/modules/products/product.repository";
import ProductController from "@/modules/products/product.controller";
import ProductService from "@/modules/products/product.service";
import ReviewRepository from "@/modules/reviews/review.repository";
import ReviewController from "@/modules/reviews/review.controller";
import ReviewService from "@/modules/reviews/review.service";
import ReservationRepository from "@/modules/reservations/reservation.repository";
import ReservationController from "@/modules/reservations/reservation.controller";
import ReservationService from "@/modules/reservations/reservation.service";
import { ReservationSeatHoldRepository } from "@/modules/reservations/reservation-seat-hold.model";
import { UploadController } from "@/modules/upload/upload.controller";
import StatsController from "@/modules/stats/stats.controller";
import { BcryptPasswordHasher } from "@/modules/auth/infrastructure/bcrypt.adapter";
import { JwtTokenService } from "@/modules/auth/infrastructure/jwt.adapter";

/**
 * The only place where concrete infrastructure dependencies are assembled.
 * Controllers and routes consume the public properties of this root.
 */
export class CompositionRoot {
  readonly authController: AuthController;
  readonly userController: UserController;
  readonly categoryController: CategoryController;
  readonly productController: ProductController;
  readonly reviewController: ReviewController;
  readonly reservationController: ReservationController;
  readonly uploadController: UploadController;
  readonly statsController: StatsController;

  constructor() {
    const userRepository = new UserRepository();
    const sessionRepository = new SessionRepository();
    const categoryRepository = new CategoryRepository();
    const productRepository = new ProductRepository();
    const reviewRepository = new ReviewRepository();
    const reservationRepository = new ReservationRepository();
    const reservationSeatHoldRepository = new ReservationSeatHoldRepository();

    this.authController = new AuthController(
      new AuthService(
        userRepository,
        sessionRepository,
        new BcryptPasswordHasher(),
        new JwtTokenService(),
      ),
    );
    this.userController = new UserController(new UserService(userRepository));
    this.categoryController = new CategoryController(new CategoryService(categoryRepository));
    this.productController = new ProductController(
      new ProductService(productRepository, categoryRepository),
    );
    this.reviewController = new ReviewController(
      new ReviewService(reviewRepository, productRepository),
    );
    this.reservationController = new ReservationController(
      new ReservationService(reservationRepository, reservationSeatHoldRepository),
    );
    this.uploadController = new UploadController();
    this.statsController = new StatsController();
  }
}

export const compositionRoot = new CompositionRoot();

// Stable named exports keep the existing route imports backwards-compatible.
export const {
  authController,
  userController,
  categoryController,
  productController,
  reviewController,
  reservationController,
  uploadController,
  statsController,
} = compositionRoot;
