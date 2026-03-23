import { Injectable } from "@nestjs/common";
import { DashScopeClient } from "../../../common/clients/dashscope.client";
import { EmbeddingProvider } from "./embedding-provider.interface";

@Injectable()
export class QwenEmbeddingProvider implements EmbeddingProvider {
  private readonly client = new DashScopeClient();
  private readonly maxBatchSize = Number(process.env.QWEN_EMBEDDING_BATCH_SIZE ?? 10);

  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    const results: number[][] = [];

    for (let index = 0; index < texts.length; index += this.maxBatchSize) {
      const batch = texts.slice(index, index + this.maxBatchSize);
      const vectors = await this.client.createEmbeddings(batch);
      results.push(...vectors);
    }

    return results;
  }
}
