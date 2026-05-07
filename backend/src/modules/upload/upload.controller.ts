import { Request, Response } from "express";
import * as uploadService from "./upload.service";
import "multer";

export class UploadController {
  /**
   * Handle single product image upload to Cloudinary
   */
  public uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      const result = await uploadService.uploadProductImage(req.file);

      return res.status(200).json({
        success: true,
        data: { url: result.url, public_id: result.public_id },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle multiple product gallery images upload to Cloudinary
   */
  public uploadGallery = async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No image files provided" });
      }

      const result = await uploadService.uploadProductGallery(req.files);

      return res.status(200).json({
        success: true,
        data: {
          urls: result.uploads.map((u) => u.url),
          public_ids: result.uploads.map((u) => u.public_id),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload gallery";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle category image upload to Cloudinary
   */
  public uploadCategoryImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      const result = await uploadService.uploadCategoryImage(req.file);

      return res.status(200).json({
        success: true,
        data: { url: result.url, public_id: result.public_id },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload category image";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle user avatar upload to Cloudinary
   */
  public uploadAvatar = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      const result = await uploadService.uploadUserAvatar(req.file);

      return res.status(200).json({
        success: true,
        data: { url: result.url, public_id: result.public_id },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload avatar";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle review photos upload to Cloudinary
   */
  public uploadReviewPhotos = async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No image files provided" });
      }

      const result = await uploadService.uploadReviewPhotos(req.files);

      return res.status(200).json({
        success: true,
        data: {
          urls: result.uploads.map((u) => u.url),
          public_ids: result.uploads.map((u) => u.public_id),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload review photos";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle image deletion from Cloudinary
   */
  public deleteImage = async (req: Request, res: Response) => {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        return res.status(400).json({ success: false, message: "Missing public_id parameter" });
      }

      await uploadService.deleteImage(Array.isArray(public_id) ? public_id[0] : public_id);

      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete image";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };

  /**
   * Handle multiple images deletion from Cloudinary
   */
  public deleteImages = async (req: Request, res: Response) => {
    try {
      const { public_ids } = req.body;

      if (!Array.isArray(public_ids) || public_ids.length === 0) {
        return res.status(400).json({ success: false, message: "public_ids array is required" });
      }

      await uploadService.deleteImages(public_ids);

      return res.status(200).json({
        success: true,
        message: "Images deleted successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete images";
      return res.status(500).json({ success: false, message: errorMessage });
    }
  };
}

export const uploadController = new UploadController();
