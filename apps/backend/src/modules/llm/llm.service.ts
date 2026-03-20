import { Injectable } from "@nestjs/common";

@Injectable()
export class LlmService {
  async complete(prompt: string) {
    return {
      model: process.env.LLM_MODEL ?? "gpt-4o-mini",
      text: `Mocked answer for: ${prompt}`,
    };
  }
}

