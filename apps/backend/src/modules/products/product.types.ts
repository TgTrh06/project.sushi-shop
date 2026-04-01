import { Types } from "mongoose";
import { IsString, IsNumber, Min, IsMongoId, IsOptional, IsBoolean, MaxLength } from 'class-validator';

// Business Entity
export interface ProductEntity {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: Types.ObjectId;
  isAvailable: boolean;
  stockQuantity: number;
  createdAt: Date;
}

// Database shape (Mongoose Document)
export interface ProductDocument extends Omit<ProductEntity, "id"> {}

// DTOs
export class CreateProductDTO {
  @IsString()
  @MaxLength(100, { message: "Tên món quá dài" })
  name!: string;

  @IsNumber()
  @Min(0, { message: "Giá không được nhỏ hơn 0" })
  price!: number;

  @IsMongoId({ message: "Danh mục (Category) không hợp lệ" })
  category!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsNumber()
  @Min(0)
  stockQuantity!: number;
}

export class UpdateProductDTO {
  @IsString()
  @MaxLength(100, { message: "Tên món quá dài" })
  name?: string;

  @IsNumber()
  @Min(0, { message: "Giá không được nhỏ hơn 0" })
  price?: number;

  @IsMongoId({ message: "Danh mục (Category) không hợp lệ" })
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsNumber()
  @Min(0)
  stockQuantity?: number;
}