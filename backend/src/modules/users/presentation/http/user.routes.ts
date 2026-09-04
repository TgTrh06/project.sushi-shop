import { Router } from "express";
import { validateBody } from "@/core/http/validation.middleware";
import { UpdateUserSchema, ChangePasswordSchema } from "./user.validator";
import type { UserController } from "./user.controller";

export function createUserRoutes(controller: UserController, auth: any, admin: any) {
  const router = Router();
  router.get("/me", auth, controller.getMe);
  router.put("/me", auth, validateBody(UpdateUserSchema), controller.update);
  router.put("/me/password", auth, validateBody(ChangePasswordSchema), controller.changePasswordHandler);
  return router;
}

export function createAdminUserRoutes(controller: UserController, auth: any, admin: any) {
  const router = Router();
  router.get("/users", auth, admin, controller.getUsers);
  router.get("/staffs", auth, admin, controller.getStaffs);
  router.get("/:id", auth, admin, controller.getOne);
  router.delete("/:id", auth, admin, controller.delete);
  return router;
}
