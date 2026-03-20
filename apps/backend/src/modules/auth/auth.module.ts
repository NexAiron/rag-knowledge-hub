import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BearerAuthGuard } from "./guards/bearer-auth.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, BearerAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
