import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly mysqlDataSource: DataSource,
    @InjectDataSource("vector")
    private readonly vectorDataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  async check() {
    const [mysql, vector, redis] = await Promise.all([
      this.checkMysql(),
      this.checkVector(),
      this.checkRedis(),
    ]);

    const allUp = mysql.up && vector.up && redis.up;

    return {
      status: allUp ? "ok" : "degraded",
      service: "@nexairon/backend",
      timestamp: new Date().toISOString(),
      dependencies: {
        mysql,
        vector,
        redis,
      },
    };
  }

  private async checkMysql() {
    try {
      await this.mysqlDataSource.query("SELECT 1");
      return { up: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "mysql error";
      return { up: false, error: message };
    }
  }

  private async checkVector() {
    try {
      await this.vectorDataSource.query("SELECT 1");
      return { up: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "vector error";
      return { up: false, error: message };
    }
  }

  private async checkRedis() {
    try {
      const client = this.redisService.getClient();
      if (client.status !== "ready") {
        await client.connect();
      }
      await client.ping();
      return { up: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "redis error";
      return { up: false, error: message };
    }
  }
}
