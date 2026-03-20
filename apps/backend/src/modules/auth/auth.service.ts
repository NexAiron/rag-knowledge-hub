import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  async register(payload: RegisterDto) {
    return {
      user: {
        id: "demo-user",
        username: payload.username,
        email: payload.email,
      },
      accessToken: `mock-access-${payload.username}`,
      refreshToken: `mock-refresh-${payload.username}`,
    };
  }

  async login(payload: LoginDto) {
    return {
      user: { id: "demo-user", username: payload.username },
      accessToken: `mock-access-${payload.username}`,
      refreshToken: `mock-refresh-${payload.username}`,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken || !refreshToken.startsWith("mock-refresh-")) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const username = refreshToken.replace("mock-refresh-", "");

    return {
      accessToken: `mock-access-${username}`,
      refreshToken: `mock-refresh-${username}`,
    };
  }

  async getProfileFromAuthHeader(authorization?: string) {
    const token = authorization?.replace("Bearer ", "");
    if (!token || !token.startsWith("mock-access-")) {
      throw new UnauthorizedException("Invalid access token");
    }

    return {
      id: "demo-user",
      username: token.replace("mock-access-", ""),
      roles: ["user"],
    };
  }
}
