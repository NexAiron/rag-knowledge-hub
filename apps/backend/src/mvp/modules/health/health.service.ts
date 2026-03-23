import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");

      return {
        status: "ok",
        service: "@nexairon/backend",
        timestamp: new Date().toISOString(),
        dependencies: {
          database: {
            up: true,
          },
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "database error";

      return {
        status: "degraded",
        service: "@nexairon/backend",
        timestamp: new Date().toISOString(),
        dependencies: {
          database: {
            up: false,
            error: message,
          },
        },
      };
    }
  }
}
