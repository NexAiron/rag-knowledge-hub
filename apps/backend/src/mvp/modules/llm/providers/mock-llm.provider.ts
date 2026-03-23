import { Injectable } from "@nestjs/common";
import { LlmMessage, LlmProvider } from "./llm-provider.interface";

@Injectable()
export class MockLlmProvider implements LlmProvider {
  async complete(messages: LlmMessage[]): Promise<string> {
    const userMessage = [...messages].reverse().find((message) => message.role === "user");
    const question = userMessage?.content?.trim() || "当前问题";
    return `这是 mock 回答。当前问题：${question}`;
  }

  async *stream(messages: LlmMessage[]): AsyncGenerator<string> {
    const content = await this.complete(messages);
    for (const char of content) {
      yield char;
    }
  }
}
