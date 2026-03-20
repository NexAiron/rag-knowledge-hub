import { Injectable } from "@nestjs/common";
import { EmbeddingsService } from "../embeddings/embeddings.service";
import { RetrieveDto } from "./dto/retrieve.dto";

@Injectable()
export class RetrievalService {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  async retrieve(payload: RetrieveDto) {
    const queryEmbedding = await this.embeddingsService.embedText(payload.query);

    return {
      kbId: payload.kbId,
      query: payload.query,
      topK: payload.topK ?? 5,
      queryEmbeddingDim: queryEmbedding.length,
      chunks: [
        {
          chunkId: "demo-chunk-1",
          score: 0.92,
          content: "This is a mocked retrieval result.",
          metadata: { source: "demo.md" },
        },
      ],
    };
  }
}

