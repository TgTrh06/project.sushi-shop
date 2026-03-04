import { Types } from "mongoose";

export interface IProduct {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: Types.ObjectId;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt: Date;
}

export interface CreateProductDTO extends Pick<IProduct, "name" | "price" | "category"> {
  description?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  stockQuantity?: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}