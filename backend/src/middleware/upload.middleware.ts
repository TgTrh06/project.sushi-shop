import multer from "multer";

/**
 * Cloudinary upload middleware
 * Uses memory storage instead of disk storage
 * Files are buffered in memory and streamed to Cloudinary
 */

// Use memory storage - files will be buffered in memory
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Only accept image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const uploadCloudinaryMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});
