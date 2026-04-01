import { IsString, IsNotEmpty, IsOptional } from "class-validator";

// Business Entity
export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Database shape - Only use for Mongoose schema definition and database operations
export interface CategoryDocument extends Omit<CategoryEntity, "id"> {}

// DTOs
export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}