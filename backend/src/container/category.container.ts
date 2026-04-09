import CategoryController from "@/modules/categories/category.controller";
import CategoryRepository from "@/modules/categories/category.repository";
import CategoryService from "@/modules/categories/category.service";

const categoryRepo = new CategoryRepository();

export const categoryService = new CategoryService(categoryRepo);
export const categoryController = new CategoryController(categoryService);