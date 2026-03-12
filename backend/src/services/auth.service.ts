import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/common/errors";
import { UserEntity, RegisterUserDTO, LoginUserDTO } from "../models/user/user.types";
import UserRepository from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import JwtUtils from "../utils/jwt";

export default class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterUserDTO): Promise<UserEntity> {
    if (!dto.username || !dto.email || !dto.password) {
      throw new BadRequestError("Missing required fields");
    }
    
    const exist = await this.repo.findByEmailForAuth(dto.email);  
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

  async login(dto: LoginUserDTO) {
    const user = await this.repo.findByEmailForAuth(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }
    
    const token = JwtUtils.generateToken(user);

    return token;
  }
}