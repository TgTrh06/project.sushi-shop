import { SafeUser, UserEntity } from "../../modules/users/user.types";

export const sanitizeUser = (user: UserEntity): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
}