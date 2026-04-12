import ProductController from "@/modules/products/product.controller";
import ProductRepository from "@/modules/products/product.repository";
import ProductService from "@/modules/products/product.service";

const productRepo = new ProductRepository();

export const productService = new ProductService(productRepo);
export const productController = new ProductController(productService);