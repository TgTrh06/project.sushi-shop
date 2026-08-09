export interface StoredFile {
  url: string;
  publicId: string;
}

export interface FileStorage {
  upload(file: Express.Multer.File, folder: string): Promise<StoredFile>;
  delete(publicId: string): Promise<void>;
  deleteMany(publicIds: string[]): Promise<void>;
}
