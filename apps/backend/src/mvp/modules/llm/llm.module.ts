import { Module } from "@nestjs/common";
import { LLM_PROVIDER } from "./providers/llm-provider.interface";
import { MockLlmProvider } from "./providers/mock-llm.provider";
import { QwenLlmProvider } from "./providers/qwen-llm.provider";
import { LlmService } from "./llm.service";

@Module({
  providers: [
    LlmService,
    {
      provide: LLM_PROVIDER,
      useFactory: () => {
        const provider = (process.env.LLM_PROVIDER ?? "qwen").toLowerCase();
        return provider === "mock" ? new MockLlmProvider() : new QwenLlmProvider();
      },
    },
  ],
  exports: [LlmService, LLM_PROVIDER],
})
export class LlmModule {}
