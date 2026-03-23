import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { EMBEDDING_PROVIDER } from "./providers/embedding-provider.interface";
import { MockEmbeddingProvider } from "./providers/mock-embedding.provider";
import { QwenEmbeddingProvider } from "./providers/qwen-embedding.provider";
import { EmbeddingsService } from "./embeddings.service";

@Module({
  imports: [PrismaModule],
  providers: [
    EmbeddingsService,
    {
      provide: EMBEDDING_PROVIDER,
      useFactory: () => {
        const provider = (process.env.EMBEDDING_PROVIDER ?? "qwen").toLowerCase();
        return provider === "mock"
          ? new MockEmbeddingProvider()
          : new QwenEmbeddingProvider();
      },
    },
  ],
  exports: [EmbeddingsService, EMBEDDING_PROVIDER],
})
export class EmbeddingsModule {}
