import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  check() {
    return {
      status: "ok",
      service: "@nexairon/backend",
      timestamp: new Date().toISOString(),
    };
  }
}

