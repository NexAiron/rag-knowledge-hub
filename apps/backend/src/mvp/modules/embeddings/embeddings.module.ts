import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import {
  EMBEDDING_PROVIDER,
} from "./providers/embedding-provider.interface";
import { MockEmbeddingProvider } from "./providers/mock-embedding.provider";
import { EmbeddingsService } from "./embeddings.service";

@Module({
  imports: [PrismaModule],
  providers: [
    EmbeddingsService,
    {
      provide: EMBEDDING_PROVIDER,
      useClass: MockEmbeddingProvider,
    },
  ],
  exports: [EmbeddingsService, EMBEDDING_PROVIDER],
})
export class EmbeddingsModule {}
