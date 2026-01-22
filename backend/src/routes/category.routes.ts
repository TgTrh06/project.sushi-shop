import { Router } from "express";
import * as controller from "../controllers/category.controller";

const router = Router();

router.post("/", controller.createCategory);
router.get("/", controller.getAllCategories);

export default router;