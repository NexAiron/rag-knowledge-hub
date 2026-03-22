import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { EmbeddingsService } from "../embeddings/embeddings.service";
import { PrismaService } from "../../prisma/prisma.service";
import { RetrieveDto } from "./dto/retrieve.dto";
import { RetrievalResult } from "./interfaces/retrieval-result.interface";

@Injectable()
export class RetrievalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingsService: EmbeddingsService,
  ) {}

  async retrieve(dto: RetrieveDto): Promise<RetrievalResult[]> {
    const topK = dto.topK ?? Number(process.env.RETRIEVAL_TOP_K ?? 5);
    const scoreThreshold = Number(process.env.RETRIEVAL_SCORE_THRESHOLD ?? 0.15);

    const [queryEmbedding] = await this.embeddingsService.embedTexts([dto.query]);
    const chunks = await this.prisma.chunk.findMany({
      where: {
        knowledgeBaseId: dto.knowledgeBaseId,
        embedding: { not: Prisma.AnyNull },
      },
      select: {
        id: true,
        content: true,
        embedding: true,
        documentId: true,
        page: true,
        metadata: true,
      },
    });

    const scored = chunks
      .map((chunk) => {
        const vector = this.parseEmbedding(chunk.embedding);
        if (!vector) {
          return null;
        }

        return {
          chunkId: chunk.id,
          content: chunk.content,
          score: this.cosineSimilarity(queryEmbedding, vector),
          documentId: chunk.documentId,
          page: chunk.page,
          metadata: (chunk.metadata as Record<string, unknown> | null) ?? null,
        } satisfies RetrievalResult;
      })
      .filter((item): item is RetrievalResult => item !== null)
      .filter((item) => item.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) {
      return 0;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i += 1) {
      const av = a[i];
      const bv = b[i];
      dot += av * bv;
      normA += av * av;
      normB += bv * bv;
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private parseEmbedding(raw: unknown): number[] | null {
    if (!raw) {
      return null;
    }

    if (Array.isArray(raw) && raw.every((item) => typeof item === "number")) {
      return raw;
    }

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "number")
        ) {
          return parsed;
        }
      } catch {
        return null;
      }
    }

    return null;
  }
}
