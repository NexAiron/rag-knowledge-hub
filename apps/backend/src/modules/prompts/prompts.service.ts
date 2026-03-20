import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptsService {
  buildRagPrompt(question: string, contexts: string[]) {
    return [
      "You are a knowledge base assistant.",
      `Question: ${question}`,
      `Contexts: ${contexts.join("\n---\n")}`,
      "Answer in concise Chinese.",
    ].join("\n");
  }
}

