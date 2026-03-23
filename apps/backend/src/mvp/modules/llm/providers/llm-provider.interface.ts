export const LLM_PROVIDER = "LLM_PROVIDER";

export type LlmMessageRole = "system" | "user" | "assistant";

export interface LlmMessage {
  role: LlmMessageRole;
  content: string;
}

export interface LlmProvider {
  complete(messages: LlmMessage[]): Promise<string>;
  stream(messages: LlmMessage[]): AsyncGenerator<string>;
}
