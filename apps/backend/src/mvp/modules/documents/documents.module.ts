import { Module } from "@nestjs/common";
import { IngestionModule } from "../ingestion/ingestion.module";
import { KbModule } from "../kb/kb.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [PrismaModule, KbModule, IngestionModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
