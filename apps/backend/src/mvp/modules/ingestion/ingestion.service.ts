import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DocumentStatus } from "@prisma/client";
import { ChunkingService } from "../chunking/chunking.service";
import { EmbeddingsService } from "../embeddings/embeddings.service";
import { ParserService } from "../parser/parser.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly parserService: ParserService,
  ) {}

  async ingestDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.processing, errorMessage: null },
    });

    try {
      const parsedDocument = await this.parserService.parseFile({
        filePath: document.filePath,
        mimeType: document.mimeType,
        title: document.title,
      });
      const cleanedText = parsedDocument.content;

      if (!cleanedText) {
        throw new Error("Document content is empty after parsing");
      }

      const chunkResults = this.chunkingService.splitText(cleanedText, {
        maxTokens: Number(process.env.CHUNK_SIZE ?? 800),
        overlapTokens: Number(process.env.CHUNK_OVERLAP ?? 100),
      });

      const createdChunks = await this.prisma.$transaction(async (tx) => {
        await tx.chunk.deleteMany({ where: { documentId } });

        const rows: Array<{ id: string; content: string }> = [];
        for (const chunk of chunkResults) {
          const created = await tx.chunk.create({
            data: {
              documentId,
              knowledgeBaseId: document.knowledgeBaseId,
              content: chunk.content,
              page: chunk.page ?? null,
              chunkIndex: chunk.chunkIndex,
              tokenCount: chunk.tokenCount,
              metadata: chunk.metadata ?? null,
            },
            select: {
              id: true,
              content: true,
            },
          });
          rows.push(created);
        }

        return rows;
      });

      await this.embeddingsService.embedAndStore(createdChunks);

      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.completed, errorMessage: null },
      });

      this.logger.log(
        `Ingestion completed for document=${documentId}, chunks=${createdChunks.length}`,
      );

      return {
        documentId,
        chunkCount: createdChunks.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown ingestion error";

      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: DocumentStatus.failed,
          errorMessage: message,
        },
      });

      this.logger.error(`Ingestion failed for document=${documentId}: ${message}`);
      throw error;
    }
  }
}
