import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import type { UploadFileUseCase, DeleteFilesUseCase } from "../../application/use-cases/upload-file.use-case";

function fileInput(file: Express.Multer.File) { return { buffer: file.buffer, mimetype: file.mimetype, originalname: file.originalname, size: file.size }; }
function filesInput(files: Express.Multer.File[]) { return files.map(fileInput); }

export class UploadController {
  constructor(private readonly upload: UploadFileUseCase, private readonly remove: DeleteFilesUseCase) {}
  image = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.upload.execute(req.file && fileInput(req.file), "products"), "Image uploaded successfully"); } catch (e) { next(e); } };
  gallery = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.upload.executeMany(Array.isArray(req.files) ? filesInput(req.files) : undefined, "products"), "Gallery uploaded successfully"); } catch (e) { next(e); } };
  category = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.upload.execute(req.file && fileInput(req.file), "categories"), "Category image uploaded successfully"); } catch (e) { next(e); } };
  avatar = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.upload.execute(req.file && fileInput(req.file), "users/avatars"), "Avatar uploaded successfully"); } catch (e) { next(e); } };
  reviewPhotos = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.upload.executeMany(Array.isArray(req.files) ? filesInput(req.files) : undefined, "reviews"), "Review photos uploaded successfully"); } catch (e) { next(e); } };
  deleteOne = async (req: Request, res: Response, next: NextFunction) => { try { await this.remove.one(String(req.params.public_id)); return HttpResponse.success(res, null, "Image deleted successfully"); } catch (e) { next(e); } };
  deleteMany = async (req: Request, res: Response, next: NextFunction) => { try { await this.remove.many(req.body.public_ids); return HttpResponse.success(res, null, "Images deleted successfully"); } catch (e) { next(e); } };
}
