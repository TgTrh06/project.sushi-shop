import type {
  ChangePasswordFormInput,
  ChangePasswordFormValues,
  UpdateUserFormInput,
  UpdateUserFormValues,
} from "./schemas/user.schema";

export const Role = {
  CUSTOMER: "customer",
  STAFF: "staff",
  ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatar_id?: string;
  phoneNumber?: number;
  passwordLastUpdated?: string | Date;
  createdAt: string | Date;
}

export type {
  UpdateUserFormInput,
  UpdateUserFormValues,
  ChangePasswordFormInput,
  ChangePasswordFormValues,
};
