import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { successHandler } from "../common/response";

const userService = new UserService();

export class UserController {
  // API Methods (JSON responses)
  static async getAllUsers(_req: Request, res: Response, next: Function) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(successHandler(200, "Users retrieved successfully.", users));
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      return res.status(200).json(successHandler(200, "User retrieved successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(successHandler(201, "User registered successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.updateUser(
        String(req.params.id),
        req.body,
      );
      return res.status(200).json(successHandler(200, "User updated successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: Function) {
    try {
      await userService.deleteUser(String(req.params.id));
      return res.status(200).json(successHandler(200, "User deleted successfully."));
    } catch (error) {
      next(error);
    }
  }

  // View Methods (EJS rendering)
  static async showAllUsers(_req: Request, res: Response, next: Function) {
    try {
      const users = await userService.getAllUsers();
      return res.render("users/list", { users, title: "All Users" });
    } catch (error) {
      next(error);
    }
  }

  static async showUserById(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      return res.render("users/detail", { user, title: `User - ${user?.username}` });
    } catch (error) {
      next(error);
    }
  }

  static async showRegisterForm(_req: Request, res: Response) {
    return res.render("users/register", { title: "Register User", error: null, body: {} });
  }

  static async handleRegister(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.register(req.body);
      // Redirect to user detail after successful registration
      return res.redirect(`/users/${user.id}`);
    } catch (error: any) {
      // Show form again with error message
      return res.render("users/register", {
        title: "Register User",
        error: error.message,
        body: req.body,
      });
    }
  }

  static async showEditForm(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      return res.render("users/edit", {
        user,
        title: `Edit User - ${user?.username}`,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleUpdate(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.updateUser(String(req.params.id), req.body);
      // Redirect to user detail after successful update
      return res.redirect(`/users/${user.id}`);
    } catch (error: any) {
      // Show form again with error message
      try {
        const user = await userService.getUserById(String(req.params.id));
        return res.render("users/edit", {
          user,
          title: `Edit User - ${user?.username}`,
          error: error.message,
        });
      } catch (e) {
        next(error);
      }
    }
  }

  static async handleDelete(req: Request, res: Response, next: Function) {
    try {
      await userService.deleteUser(String(req.params.id));
      // Redirect to users list after successful delete
      return res.redirect("/users");
    } catch (error) {
      next(error);
    }
  }
}