import ProductController from "@/modules/products/product.controller";
import ProductRepository from "@/modules/products/product.repository";
import ProductService from "@/modules/products/product.service";
import { categoryRepo } from "./category.container";

const productRepo = new ProductRepository();

export const productService = new ProductService(productRepo, categoryRepo);
export const productController = new ProductController(productService);