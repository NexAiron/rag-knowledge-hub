import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  async login(payload: LoginDto) {
    return {
      user: { id: "demo-user", username: payload.username },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };
  }
}

