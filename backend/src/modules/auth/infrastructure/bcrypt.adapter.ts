import { comparePassword, hashPassword } from "@/utils/security/bcrypt.util";
import type { PasswordHasher } from "../domain/ports/auth.ports";

export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return hashPassword(password);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return comparePassword(password, hash);
  }
}
