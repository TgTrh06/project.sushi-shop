import { v2 as cloudinary } from "cloudinary";
import { env } from "@/core/config/env.config";
import type { FileStorage, UploadFile, StoredFile } from "@/core/ports/file-storage.port";

cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });

export class CloudinaryFileStorage implements FileStorage {
  upload(file: UploadFile, folder: string): Promise<StoredFile> { return new Promise((resolve, reject) => { const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image", format: "webp" }, (error, result) => { if (error || !result) { reject(new Error(error?.message ?? "Cloudinary upload failed")); return; } resolve({ url: result.secure_url, publicId: result.public_id }); }); stream.end(file.buffer); }); }
  delete(publicId: string): Promise<void> { return new Promise((resolve, reject) => { cloudinary.uploader.destroy(publicId, (error) => error ? reject(error) : resolve()); }); }
  async deleteMany(publicIds: string[]) { await Promise.all(publicIds.map((id) => this.delete(id))); }
}
