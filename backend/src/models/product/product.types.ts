import { Types } from "mongoose";

// Business Entity
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: Types.ObjectId;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt: Date;
}

// Types for DTOs
type RequiredFields = Pick<Product, "name" | "price" | "category"> ;

type OptionalFields = Partial<Omit<Product, keyof RequiredFields>>;

// DTOs
export interface CreateProductDTO extends RequiredFields, OptionalFields {}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

// Database shape (Mongoose Document)
export interface ProductDocument extends Omit<Product, "id"> {}