interface DashScopeMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DashScopeChatResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string; type?: string }>;
    };
  }>;
}

interface DashScopeEmbeddingResponse {
  data?: Array<{
    embedding?: number[];
  }>;
}

export class DashScopeClient {
  private readonly apiKey = process.env.DASHSCOPE_API_KEY?.trim();
  private readonly baseUrl = (
    process.env.DASHSCOPE_BASE_URL ??
    "https://dashscope.aliyuncs.com/compatible-mode/v1"
  ).replace(/\/$/, "");
  private readonly chatModel =
    process.env.QWEN_CHAT_MODEL?.trim() || "qwen3.5-plus";
  private readonly embeddingModel =
    process.env.QWEN_EMBEDDING_MODEL?.trim() || "text-embedding-v4";
  private readonly embeddingDimension = Number(
    process.env.QWEN_EMBEDDING_DIMENSION ?? 1024,
  );
  private readonly temperature = Number(process.env.QWEN_TEMPERATURE ?? 0.2);
  private readonly maxTokens = Number(process.env.QWEN_MAX_TOKENS ?? 2048);

  constructor() {
    if (!this.apiKey) {
      throw new Error("DASHSCOPE_API_KEY is required");
    }
  }

  async createChatCompletion(messages: DashScopeMessage[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: this.chatModel,
        messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(await this.readError(response));
    }

    const payload = (await response.json()) as DashScopeChatResponse;
    return this.extractMessageContent(payload);
  }

  async *createChatStream(
    messages: DashScopeMessage[],
  ): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: this.chatModel,
        messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(await this.readError(response));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let separatorIndex = buffer.indexOf("\n\n");

      while (separatorIndex !== -1) {
        const rawEvent = buffer.slice(0, separatorIndex).trim();
        buffer = buffer.slice(separatorIndex + 2);
        separatorIndex = buffer.indexOf("\n\n");

        if (!rawEvent) {
          continue;
        }

        const dataLines = rawEvent
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());

        for (const dataLine of dataLines) {
          if (!dataLine || dataLine === "[DONE]") {
            continue;
          }

          const payload = JSON.parse(dataLine) as {
            choices?: Array<{
              delta?: {
                content?: string | Array<{ text?: string; type?: string }>;
              };
            }>;
          };

          const delta = payload.choices?.[0]?.delta?.content;
          const token = this.normalizeContent(delta);
          if (token) {
            yield token;
          }
        }
      }
    }
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: this.embeddingModel,
        input: texts,
        dimensions: this.embeddingDimension,
        encoding_format: "float",
      }),
    });

    if (!response.ok) {
      throw new Error(await this.readError(response));
    }

    const payload = (await response.json()) as DashScopeEmbeddingResponse;
    return (payload.data ?? []).map((item) => item.embedding ?? []);
  }

  private buildHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private extractMessageContent(payload: DashScopeChatResponse): string {
    const content = payload.choices?.[0]?.message?.content;
    return this.normalizeContent(content);
  }

  private normalizeContent(
    content: string | Array<{ text?: string; type?: string }> | undefined,
  ): string {
    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((item) => item.text ?? "")
        .join("")
        .trim();
    }

    return "";
  }

  private async readError(response: Response): Promise<string> {
    const text = await response.text();
    if (!text) {
      return "Request to DashScope failed";
    }

    try {
      const payload = JSON.parse(text) as {
        error?: {
          message?: string;
        };
        message?: string;
      };

      return payload.error?.message ?? payload.message ?? text;
    } catch {
      return text;
    }
  }
}
