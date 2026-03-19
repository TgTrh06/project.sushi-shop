import { BadRequestError, ConflictError, UnauthorizedError } from "../../utils/common/error";
import { RegisterUserDTO, LoginUserDTO } from "../users/user.types";
import UserRepository from "../users/user.repository";
import { hashPassword, comparePassword } from "../../utils/security/bcrypt";
import JwtUtils from "../../utils/security/jwt";

export default class AuthService {
  private repo = new UserRepository();

  // async register(dto: RegisterUserDTO): Promise<Omit<UserEntity, "password">> {
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

    const { password, ...safeUser } = newUser;
    const token = JwtUtils.generateToken(newUser);
    
    return { token, user: safeUser };
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

    const { password, ...safeUser } = existUser;
    
    return { token, user: safeUser };
  }
}