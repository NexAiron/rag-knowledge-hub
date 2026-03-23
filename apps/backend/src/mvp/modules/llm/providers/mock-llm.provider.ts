import { Injectable } from "@nestjs/common";
import { LlmMessage, LlmProvider } from "./llm-provider.interface";

@Injectable()
export class MockLlmProvider implements LlmProvider {
  async complete(messages: LlmMessage[]): Promise<string> {
    const userMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    const question = userMessage?.content?.trim() || "当前问题";

    return [
      "这是调试模式下的模拟回答。",
      `当前问题：${question}`,
      "如果已经配置真实模型，可以将 `LLM_PROVIDER` 切换到对应 provider。",
    ].join("\n");
  }

  async *stream(messages: LlmMessage[]): AsyncGenerator<string> {
    const content = await this.complete(messages);
    for (const char of content) {
      yield char;
    }
  }
}
