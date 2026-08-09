import multer from "multer";

const imageFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  callback(null, file.mimetype.startsWith("image/"));
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 10 },
  fileFilter: imageFilter,
});
