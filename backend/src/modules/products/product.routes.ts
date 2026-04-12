import { productController } from "@/container/product.container";
import { Router } from "express";

const router = Router();

router.post("/", productController.create);

router.get("/", productController.getAll);

router.get("/category/:slug", productController.getListByCategory);

router.get("/:id", productController.getOneById);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;