import { Controller, Param, Post } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";

@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(":documentId/run")
  async run(@Param("documentId") documentId: string) {
    return this.ingestionService.run(documentId);
  }
}

