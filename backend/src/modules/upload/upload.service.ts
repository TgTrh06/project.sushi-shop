import * as cloudinaryService from "@/utils/common/cloudinary.util";

export interface UploadResult {
  url: string;
  public_id: string;
}

export interface UploadMultipleResult {
  uploads: UploadResult[];
}

/**
 * Upload a product image
 */
export async function uploadProductImage(file: Express.Multer.File): Promise<UploadResult> {
  const result = await cloudinaryService.uploadImage(file, "products");
  return {
    url: result.url,
    public_id: result.public_id,
  };
}

/**
 * Upload multiple product gallery images
 */
export async function uploadProductGallery(
  files: Express.Multer.File[]
): Promise<UploadMultipleResult> {
  const results = await cloudinaryService.uploadMultiple(files, "products");
  return {
    uploads: results.map((r) => ({
      url: r.url,
      public_id: r.public_id,
    })),
  };
}

/**
 * Upload a category image
 */
export async function uploadCategoryImage(file: Express.Multer.File): Promise<UploadResult> {
  const result = await cloudinaryService.uploadImage(file, "categories");
  return {
    url: result.url,
    public_id: result.public_id,
  };
}

/**
 * Upload a user avatar
 */
export async function uploadUserAvatar(file: Express.Multer.File): Promise<UploadResult> {
  const result = await cloudinaryService.uploadImage(file, "users/avatars");
  return {
    url: result.url,
    public_id: result.public_id,
  };
}

/**
 * Upload review photos (multiple)
 */
export async function uploadReviewPhotos(
  files: Express.Multer.File[]
): Promise<UploadMultipleResult> {
  const results = await cloudinaryService.uploadMultiple(files, "reviews");
  return {
    uploads: results.map((r) => ({
      url: r.url,
      public_id: r.public_id,
    })),
  };
}

/**
 * Delete a single image
 */
export async function deleteImage(public_id: string): Promise<void> {
  await cloudinaryService.deleteImage(public_id);
}

/**
 * Delete multiple images
 */
export async function deleteImages(public_ids: string[]): Promise<void> {
  if (public_ids.length > 0) {
    await cloudinaryService.deleteMultiple(public_ids);
  }
}
