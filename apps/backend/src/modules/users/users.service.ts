import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  async profile(userId: string) {
    return {
      id: userId,
      nickname: "NexAiron User",
      createdAt: new Date().toISOString(),
    };
  }
}

