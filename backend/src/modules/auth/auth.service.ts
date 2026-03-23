import { BadRequestError, ConflictError, UnauthorizedError } from "../../core/utils/common/error.utils";
import { RegisterUserDTO, LoginUserDTO } from "../users/user.types";
import UserRepository from "../users/user.repository";
import { hashPassword, comparePassword } from "../../core/utils/security/bcrypt.utils";
import JwtUtils from "../../core/utils/security/jwt.utils";
import { sanitizeUser } from "../../core/utils/security/sanitize.utils";

export default class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterUserDTO) {
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

    const token = JwtUtils.generateToken(newUser);

    const user = sanitizeUser(newUser);
    
    return { token, user };
  }

  async login(dto: LoginUserDTO) {
    const existUser = await this.repo.findByEmailForAuth(dto.email);
    if (!existUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await comparePassword(dto.password, existUser.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }
    
    const token = JwtUtils.generateToken(existUser);

    const user = sanitizeUser(existUser);
    
    return { token, user };
  }
}