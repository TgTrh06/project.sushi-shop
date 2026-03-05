import { Router } from "express";
import UserRoute from "./user.routes";
import CategoryRoute from "./category.routes";

const router = Router();

// Basic route to test if the server is running
router.get("/", (req, res) => {
  res.send("Welcome to the Sushi Shop API!");
});

// API routes
router.use("/api/categories", CategoryRoute);
router.use("/api/users", UserRoute);

export default router;