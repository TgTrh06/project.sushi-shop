import { BadRequestError } from "@/core/errors";
import type { FileStorage, UploadFile } from "../../domain/ports/file-storage.port";

export class UploadFileUseCase {
  constructor(private readonly storage: FileStorage) {}
  async execute(file: UploadFile | undefined, folder: string) { if (!file) throw new BadRequestError("No image file provided"); const result = await this.storage.upload(file, folder); return { url: result.url, public_id: result.publicId }; }
  async executeMany(files: UploadFile[] | undefined, folder: string) { if (!files?.length) throw new BadRequestError("No image files provided"); const result = await Promise.all(files.map((file) => this.storage.upload(file, folder))); return { urls: result.map((item) => item.url), public_ids: result.map((item) => item.publicId) }; }
}

export class DeleteFilesUseCase { constructor(private readonly storage: FileStorage) {} async one(id: string) { if (!id) throw new BadRequestError("Missing public_id parameter"); await this.storage.delete(id); } async many(ids: unknown) { if (!Array.isArray(ids) || !ids.length || ids.some((id) => typeof id !== "string")) throw new BadRequestError("public_ids array is required"); await this.storage.deleteMany(ids); } }
