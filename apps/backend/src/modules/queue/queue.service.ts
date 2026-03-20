import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class QueueService {
  constructor(private readonly redisService: RedisService) {}

  async enqueue(queueName: string, payload: unknown) {
    const client = this.redisService.getClient();
    await client.lpush(`queue:${queueName}`, JSON.stringify(payload));
    return { queueName, queued: true };
  }
}

