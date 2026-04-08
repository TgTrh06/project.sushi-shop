import CategoryController from "../modules/categories/category.controller";
import CategoryRepository from "../modules/categories/category.repository";
import CategoryService from "../modules/categories/category.service";

const categoryRepo = new CategoryRepository();
const categoryService = new CategoryService(categoryRepo);
const categoryController = new CategoryController(categoryService);

export { categoryService, categoryController };