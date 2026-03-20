import { Injectable } from "@nestjs/common";
import { QueueService } from "../queue/queue.service";
import { DocumentsService } from "../documents/documents.service";

@Injectable()
export class IngestionService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly queueService: QueueService,
  ) {}

  async run(documentId: string) {
    const document = await this.documentsService.findOne(documentId);
    await this.documentsService.updateStatus(documentId, "processing");

    await this.queueService.enqueue("ingestion", {
      documentId,
      kbId: document.kbId,
      fileName: document.fileName,
      createdAt: new Date().toISOString(),
    });

    return {
      documentId,
      steps: ["parse", "chunk", "embed", "upsert_vector"],
      status: "queued",
    };
  }
}
