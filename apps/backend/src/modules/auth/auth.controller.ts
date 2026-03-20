import { Body, Controller, Get, Headers, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { BearerAuthGuard } from "./guards/bearer-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post("login")
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("refresh")
  async refresh(@Body() payload: RefreshTokenDto) {
    return this.authService.refresh(payload.refreshToken);
  }

  @Get("me")
  @UseGuards(BearerAuthGuard)
  async me(@Headers("authorization") authorization?: string) {
    return this.authService.getProfileFromAuthHeader(authorization);
  }
}
