import bcrypt from "bcrypt";
import type { PasswordHasher } from "../domain/ports/password-hasher.port";

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly rounds = 12) {}
  hash(value: string) { return bcrypt.hash(value, this.rounds); }
  compare(value: string, hash: string) { return bcrypt.compare(value, hash); }
}
