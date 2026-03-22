import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { AuthUserDto } from "./dto/auth-user.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "../users/users.service";

const PASSWORD_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.buildAuthResponse(this.usersService.toSafeUser(user));
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<AuthResponseDto> {
    const currentUser = await this.usersService.findById(userId);
    if (!currentUser) {
      throw new NotFoundException("User not found");
    }

    try {
      const user = await this.usersService.updateProfile({
        id: userId,
        email: dto.email?.trim(),
        name: dto.name?.trim(),
      });

      return this.buildAuthResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Email is already registered");
      }

      throw error;
    }
  }

  private async buildAuthResponse(user: AuthUserDto): Promise<AuthResponseDto> {
    const accessToken = await this.signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      access_token: accessToken,
      user,
    };
  }

  private async signToken(payload: {
    id: string;
    email: string;
    name?: string | null;
  }): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.id,
      email: payload.email,
      name: payload.name,
    });
  }
}
