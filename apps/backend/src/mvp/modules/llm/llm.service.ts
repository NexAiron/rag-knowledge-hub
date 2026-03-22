import { Inject, Injectable } from "@nestjs/common";
import { LLM_PROVIDER, LlmProvider } from "./providers/llm-provider.interface";

@Injectable()
export class LlmService {
  constructor(
    @Inject(LLM_PROVIDER) private readonly provider: LlmProvider,
  ) {}

  complete(prompt: string) {
    return this.provider.complete(prompt);
  }

  stream(prompt: string) {
    return this.provider.stream(prompt);
  }
}
