import { Request, Response } from "express";
import { env } from "@/config/env.config";
import "multer";

export class UploadController {
  /**
   * Handle single image upload
   */
  public uploadImage = (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      // const imageUrl = `${env.FRONTEND_URL || "http://localhost:" + env.PORT}/uploads/${req.file.filename}`;
      const imageUrl = `http://localhost:${env.PORT}/uploads/${req.file.filename}`;
      // Note: we can use a relative or absolute URL. Better to just use relative if they share the same origin, 
      // but since they might be separate, let's use the absolute backend URL.
      // Assuming localhost:PORT is the backend URL.
      const backendUrl = `http://localhost:${env.PORT}`;
      const fullUrl = `${backendUrl}/uploads/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        data: { url: fullUrl },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }
  };

  /**
   * Handle multiple images upload (gallery)
   */
  public uploadGallery = (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No image files provided" });
      }

      const backendUrl = `http://localhost:${env.PORT}`;
      const urls = req.files.map((file: Express.Multer.File) => `${backendUrl}/uploads/${file.filename}`);

      return res.status(200).json({
        success: true,
        data: { urls },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to upload gallery" });
    }
  };
}

export const uploadController = new UploadController();
