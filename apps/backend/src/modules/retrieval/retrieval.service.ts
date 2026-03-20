import { Injectable } from "@nestjs/common";
import { EmbeddingsService } from "../embeddings/embeddings.service";
import { RetrieveDto } from "./dto/retrieve.dto";

@Injectable()
export class RetrievalService {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  async retrieve(payload: RetrieveDto) {
    const queryEmbedding = await this.embeddingsService.embedText(payload.query);
    const topK = payload.topK ?? 5;
    const scoreThreshold = payload.scoreThreshold ?? 0;

    const candidates = [
      {
        chunkId: "demo-chunk-1",
        score: 0.92,
        content: "This is a mocked retrieval result.",
        metadata: { source: "demo.md" },
      },
      {
        chunkId: "demo-chunk-2",
        score: 0.74,
        content: "Another mocked retrieval snippet for ranking.",
        metadata: { source: "guide.md" },
      },
      {
        chunkId: "demo-chunk-3",
        score: 0.58,
        content: "Lower score snippet for threshold filtering.",
        metadata: { source: "faq.md" },
      },
    ];

    const chunks = candidates
      .filter((item) => item.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return {
      kbId: payload.kbId,
      query: payload.query,
      topK,
      scoreThreshold,
      queryEmbeddingDim: queryEmbedding.length,
      chunks,
    };
  }
}
