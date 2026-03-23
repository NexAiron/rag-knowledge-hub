import { Injectable } from "@nestjs/common";
import { LlmProvider } from "./llm-provider.interface";

@Injectable()
export class MockLlmProvider implements LlmProvider {
  async complete(prompt: string): Promise<string> {
    const preview = prompt.slice(0, 240);
    return `这是基于检索内容生成的示例回答（MVP Mock）。\n\n${preview}`;
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    const content = await this.complete(prompt);
    const pieces = content.split("");

    for (const piece of pieces) {
      yield piece;
    }
  }
}
