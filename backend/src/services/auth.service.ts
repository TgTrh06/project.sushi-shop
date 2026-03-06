import { BadRequestError, ConflictError, UnauthorizedError } from "../common/errors";
import { UserEntity, RegisterUserDTO, LoginDTO } from "../models/user/user.types";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterUserDTO): Promise<UserEntity> {
    if (!dto.username || !dto.email || !dto.password) {
      throw new BadRequestError("Missing required fields");
    }
    const exist = await this.repo.findByEmail(dto.email);
  
    if (exist) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.repo.create({
      ...dto,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(dto: LoginDTO) {
    const user = await this.repo.findByEmail(dto.email);
    
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await comparePassword(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return generateToken(user);
  }
}