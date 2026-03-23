export const LLM_PROVIDER = "LLM_PROVIDER";

export interface LlmProvider {
  complete(prompt: string): Promise<string>;
  stream(prompt: string): AsyncGenerator<string>;
}
