import { AuthUserDto } from "./auth-user.dto";

export class AuthResponseDto {
  access_token!: string;
  user!: AuthUserDto;
}
