import { Router } from "express";
import { uploadController } from "./upload.controller";
import { uploadCloudinaryMiddleware } from "@/middleware/upload.cloudinary.middleware";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";

const router = Router();

// Product image upload (single)
router.post(
  "/image",
  verifyAuth,
  verifyAdmin,
  uploadCloudinaryMiddleware.single("image"),
  uploadController.uploadImage
);

// Product gallery upload (multiple, max 10)
router.post(
  "/gallery",
  verifyAuth,
  verifyAdmin,
  uploadCloudinaryMiddleware.array("images", 10),
  uploadController.uploadGallery
);

// Category image upload (single)
router.post(
  "/category",
  verifyAuth,
  verifyAdmin,
  uploadCloudinaryMiddleware.single("image"),
  uploadController.uploadCategoryImage
);

// User avatar upload (single)
router.post(
  "/avatar",
  verifyAuth,
  uploadCloudinaryMiddleware.single("avatar"),
  uploadController.uploadAvatar
);

// Review photos upload (multiple, max 5)
router.post(
  "/review-photos",
  verifyAuth,
  uploadCloudinaryMiddleware.array("photos", 5),
  uploadController.uploadReviewPhotos
);

// Delete single image
router.delete(
  "/image/:public_id",
  verifyAuth,
  uploadController.deleteImage
);

// Delete multiple images
router.post(
  "/delete-multiple",
  verifyAuth,
  uploadController.deleteImages
);

export default router;
