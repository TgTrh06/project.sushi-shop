import { cloudinary } from "../../config/cloudinary.config";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

interface CloudinaryDeleteResult {
  result: string;
}

/**
 * Upload a single image to Cloudinary
 * @param file - Express Multer file object
 * @param folder - Cloudinary folder path (e.g., 'products', 'categories', 'users/avatars')
 * @returns Upload result with URL and public_id
 */
export async function uploadImage(
  file: Express.Multer.File,
  folder: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
        format: "webp", // Convert to WebP for optimization
      },
      (error: any, result?: any) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
      }
    );

    // Write file buffer to upload stream
    uploadStream.end(file.buffer);
  });
}

/**
 * Upload multiple images to Cloudinary (batch upload)
 * @param files - Array of Express Multer file objects
 * @param folder - Cloudinary folder path
 * @returns Array of upload results
 */
export async function uploadMultiple(
  files: Express.Multer.File[],
  folder: string
): Promise<CloudinaryUploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete an image from Cloudinary by public_id
 * @param public_id - Cloudinary public ID of the asset
 * @returns Deletion result
 */
export async function deleteImage(public_id: string): Promise<CloudinaryDeleteResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary deletion failed: ${error.message}`));
      } else {
        resolve({ result: result?.result || "ok" });
      }
    });
  });
}

/**
 * Delete multiple images from Cloudinary
 * @param public_ids - Array of Cloudinary public IDs
 * @returns Array of deletion results
 */
export async function deleteMultiple(public_ids: string[]): Promise<CloudinaryDeleteResult[]> {
  const deletePromises = public_ids.map((public_id) => deleteImage(public_id));
  return Promise.all(deletePromises);
}

/**
 * Generate a signed URL for secure asset access
 * @param public_id - Cloudinary public ID
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed secure URL
 */
export function generateSignedUrl(public_id: string, expiresIn: number = 3600): string {
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

  const signedUrl = cloudinary.url(public_id, {
    sign_url: true,
    type: "authenticated",
    format: "webp",
  });

  return signedUrl;
}

/**
 * Get a transformation URL with custom parameters
 * @param public_id - Cloudinary public ID
 * @param transformations - Custom transformation parameters
 * @returns URL with applied transformations
 */
export function getTransformedUrl(
  public_id: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
): string {
  const defaultTransformations = {
    quality: "auto",
    format: "auto",
  };

  const mergedTransformations = {
    ...defaultTransformations,
    ...transformations,
  };

  return cloudinary.url(public_id, mergedTransformations);
}

/**
 * Get a thumbnail-sized transformation URL
 * @param public_id - Cloudinary public ID
 * @returns URL for thumbnail (small, optimized)
 */
export function getThumbnailUrl(public_id: string): string {
  return getTransformedUrl(public_id, {
    width: 150,
    height: 150,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Get a card-sized transformation URL
 * @param public_id - Cloudinary public ID
 * @returns URL for card display (medium, optimized)
 */
export function getCardUrl(public_id: string): string {
  return getTransformedUrl(public_id, {
    width: 300,
    height: 300,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Get a full-size transformation URL
 * @param public_id - Cloudinary public ID
 * @returns URL for full display (high quality, optimized)
 */
export function getFullUrl(public_id: string): string {
  return getTransformedUrl(public_id, {
    width: 1200,
    height: 1200,
    crop: "fit",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Get an avatar-sized transformation URL
 * @param public_id - Cloudinary public ID
 * @returns URL for avatar display (small, optimized)
 */
export function getAvatarUrl(public_id: string): string {
  return getTransformedUrl(public_id, {
    width: 100,
    height: 100,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}
