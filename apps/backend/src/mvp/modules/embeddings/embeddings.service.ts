import { Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  EMBEDDING_PROVIDER,
  EmbeddingProvider,
} from "./providers/embedding-provider.interface";

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(EMBEDDING_PROVIDER)
    private readonly provider: EmbeddingProvider,
  ) {}

  embedTexts(texts: string[]) {
    return this.provider.embed(texts);
  }

  async embedAndStore(chunks: Array<{ id: string; content: string }>) {
    if (chunks.length === 0) {
      return { updated: 0 };
    }

    const batchSize = Number(process.env.EMBEDDING_BATCH_SIZE ?? 20);
    let updated = 0;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const vectors = await this.provider.embed(batch.map((item) => item.content));

      const operations = batch.map((chunk, index) =>
        this.prisma.chunk.update({
          where: { id: chunk.id },
          data: { embedding: vectors[index] },
        }),
      );

      await this.prisma.$transaction(operations);
      updated += batch.length;
    }

    this.logger.log(`Embedded and stored ${updated} chunks`);
    return { updated };
  }
}
