export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface StoredFile {
  url: string;
  publicId: string;
}

export interface FileStorage {
  upload(file: UploadFile, folder: string): Promise<StoredFile>;
  delete(publicId: string): Promise<void>;
  deleteMany(publicIds: string[]): Promise<void>;
}
