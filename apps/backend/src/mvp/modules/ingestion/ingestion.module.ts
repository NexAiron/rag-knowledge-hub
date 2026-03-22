import { Module } from "@nestjs/common";
import { ChunkingModule } from "../chunking/chunking.module";
import { EmbeddingsModule } from "../embeddings/embeddings.module";
import { ParserModule } from "../parser/parser.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { IngestionService } from "./ingestion.service";

@Module({
  imports: [PrismaModule, ChunkingModule, EmbeddingsModule, ParserModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
