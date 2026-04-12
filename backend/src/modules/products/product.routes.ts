import { productController } from "@/container/product.container";
import { Router } from "express";

const router = Router();

router.post("/", productController.create);

router.get("/", productController.getAll);

router.get("/category/:categoryId", productController.getListByCategory);

router.get("/:productId", productController.getOneById);
router.put("/:productId", productController.update);
router.delete("/:productId", productController.delete);

export default router;