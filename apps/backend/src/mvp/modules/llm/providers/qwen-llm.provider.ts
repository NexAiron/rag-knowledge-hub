import { Injectable } from "@nestjs/common";
import { DashScopeClient } from "../../../common/clients/dashscope.client";
import { LlmMessage, LlmProvider } from "./llm-provider.interface";

@Injectable()
export class QwenLlmProvider implements LlmProvider {
  private readonly client = new DashScopeClient();

  complete(messages: LlmMessage[]): Promise<string> {
    return this.client.createChatCompletion(messages);
  }

  stream(messages: LlmMessage[]): AsyncGenerator<string> {
    return this.client.createChatStream(messages);
  }
}
