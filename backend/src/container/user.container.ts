import UserController from "@/modules/users/user.controller";
import UserRepository from "@/modules/users/user.repository";
import UserService from "@/modules/users/user.service";

const userRepo = new UserRepository();

export const userSerivce = new UserService(userRepo);
export const userController = new UserController(userSerivce);