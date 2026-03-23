import { Inject, Injectable } from "@nestjs/common";
import {
  LLM_PROVIDER,
  LlmMessage,
  LlmProvider,
} from "./providers/llm-provider.interface";

@Injectable()
export class LlmService {
  constructor(
    @Inject(LLM_PROVIDER) private readonly provider: LlmProvider,
  ) {}

  complete(messages: LlmMessage[]) {
    return this.provider.complete(messages);
  }

  stream(messages: LlmMessage[]) {
    return this.provider.stream(messages);
  }
}
