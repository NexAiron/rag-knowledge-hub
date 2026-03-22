import { Module } from "@nestjs/common";
import { LLM_PROVIDER } from "./providers/llm-provider.interface";
import { MockLlmProvider } from "./providers/mock-llm.provider";
import { LlmService } from "./llm.service";

@Module({
  providers: [
    LlmService,
    {
      provide: LLM_PROVIDER,
      useClass: MockLlmProvider,
    },
  ],
  exports: [LlmService, LLM_PROVIDER],
})
export class LlmModule {}
