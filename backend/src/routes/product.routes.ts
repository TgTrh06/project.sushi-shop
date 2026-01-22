import { Router } from "express";
import * as controller from "../controllers/product.controller";

const router = Router();

router.post("/", controller.createProduct);
router.get("/", controller.getAllProducts);
router.get("/category/:categoryId", controller.getProductsByCategory);

export default router;