import { Controller, Param, Post } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";

@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post(":documentId/run")
  async run(@Param("documentId") documentId: string) {
    const result = await this.ingestionService.run(documentId);
    return {
      ...result,
      nextAction: "worker-consume-queue",
    };
  }
}
