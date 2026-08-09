import { Router } from "express";
import { uploadMiddleware } from "@/core/http/upload.middleware";
import type { UploadController } from "../controllers/upload.controller";

export function createUploadRoutes(controller: UploadController, auth: any, admin: any) {
  const router = Router();
  router.post("/image", auth, admin, uploadMiddleware.single("image"), controller.image);
  router.post("/gallery", auth, admin, uploadMiddleware.array("images", 10), controller.gallery);
  router.post("/category", auth, admin, uploadMiddleware.single("image"), controller.category);
  router.post("/avatar", auth, uploadMiddleware.single("avatar"), controller.avatar);
  router.post("/review-photos", auth, uploadMiddleware.array("photos", 5), controller.reviewPhotos);
  router.delete("/image/:public_id", auth, admin, controller.deleteOne);
  router.post("/delete-multiple", auth, admin, controller.deleteMany);
  return router;
}
