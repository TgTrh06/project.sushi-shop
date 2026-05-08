/**
 * Cloudinary URL transformation utilities for the frontend
 * Builds optimized URLs with responsive sizing and format negotiation
 */

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "itsu-sushi";

/**
 * Get a thumbnail-sized transformation URL (small, optimized)
 * @param public_id - Cloudinary public ID of the image
 * @returns Cloudinary URL with thumbnail transformations
 */
export function getThumbnailUrl(public_id: string): string {
  return `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/image/upload/w_150,h_150,c_fill,q_auto,f_auto/${public_id}`;
}

/**
 * Get a card-sized transformation URL (medium, optimized for product cards)
 * @param public_id - Cloudinary public ID of the image
 * @returns Cloudinary URL with card transformations
 */
export function getCardUrl(public_id: string): string {
  return `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/${public_id}`;
}

/**
 * Get a full-size transformation URL (high quality, optimized for detail view)
 * @param public_id - Cloudinary public ID of the image
 * @returns Cloudinary URL with full-size transformations
 */
export function getFullUrl(public_id: string): string {
  return `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/image/upload/w_1200,h_1200,c_fit,q_auto,f_auto/${public_id}`;
}

/**
 * Get an avatar-sized transformation URL (small, circular, optimized)
 * @param public_id - Cloudinary public ID of the image
 * @returns Cloudinary URL with avatar transformations
 */
export function getAvatarUrl(public_id: string): string {
  return `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/image/upload/w_100,h_100,c_fill,g_face,q_auto,f_auto,r_max/${public_id}`;
}

/**
 * Get a custom transformation URL
 * @param public_id - Cloudinary public ID of the image
 * @param transformations - Custom transformation string (e.g., "w_500,h_500,c_fill")
 * @returns Cloudinary URL with custom transformations
 */
export function getCustomUrl(public_id: string, transformations: string = ""): string {
  const baseTransform = transformations ? `${transformations},q_auto,f_auto` : "q_auto,f_auto";
  return `${CLOUDINARY_BASE_URL}/${CLOUD_NAME}/image/upload/${baseTransform}/${public_id}`;
}

/**
 * Build a local URL fallback or Cloudinary URL based on whether public_id exists
 * Use this for backward compatibility with existing local file URLs
 * @param url - Existing URL (could be local path or full Cloudinary URL)
 * @param public_id - Optional Cloudinary public ID
 * @param transformation - Transformation function to apply if public_id exists
 * @returns Appropriate URL based on availability
 */
export function getImageUrl(
  url: string | undefined,
  public_id: string | undefined,
  transformation: (id: string) => string = getCardUrl
): string {
  if (public_id) {
    return transformation(public_id);
  }
  return url || "https://placehold.co/300x300?text=No+Image";
}

/**
 * Get responsive image srcset for multiple sizes
 * Useful for HTML img srcset attribute
 * @param public_id - Cloudinary public ID of the image
 * @returns srcset string for responsive images
 */
export function getResponsiveImageSet(public_id: string): string {
  return [
    `${getCustomUrl(public_id, "w_300")} 300w`,
    `${getCustomUrl(public_id, "w_600")} 600w`,
    `${getCustomUrl(public_id, "w_1200")} 1200w`,
  ].join(", ");
}
