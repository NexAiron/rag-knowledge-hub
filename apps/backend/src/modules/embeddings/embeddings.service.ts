import { Injectable } from "@nestjs/common";

@Injectable()
export class EmbeddingsService {
  async embedText(text: string): Promise<number[]> {
    const seed = text.length % 10;
    return Array.from({ length: 8 }, (_, idx) => Number((seed + idx) / 10));
  }
}

