import { Module } from "@nestjs/common";
import { DocumentsModule } from "../documents/documents.module";
import { QueueModule } from "../queue/queue.module";
import { IngestionController } from "./ingestion.controller";
import { IngestionService } from "./ingestion.service";

@Module({
  imports: [DocumentsModule, QueueModule],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
