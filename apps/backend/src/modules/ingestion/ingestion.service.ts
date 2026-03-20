import { Injectable } from "@nestjs/common";

@Injectable()
export class IngestionService {
  async run(documentId: string) {
    return {
      documentId,
      steps: ["parse", "chunk", "embed", "upsert_vector"],
      status: "queued",
    };
  }
}

