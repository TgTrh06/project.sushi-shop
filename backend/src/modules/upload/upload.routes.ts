import { Router } from "express";
import { uploadController } from "./upload.controller";
import { uploadMiddleware } from "@/middleware/upload.middleware";
import { verifyAuth, verifyAdmin } from "@/middleware/auth.middleware";

const router = Router();

// Single image upload
router.post(
  "/image",
  verifyAuth,
  verifyAdmin,
  uploadMiddleware.single("image"),
  uploadController.uploadImage
);

// Multiple images upload (max 10)
router.post(
  "/gallery",
  verifyAuth,
  verifyAdmin,
  uploadMiddleware.array("images", 10),
  uploadController.uploadGallery
);

export default router;
