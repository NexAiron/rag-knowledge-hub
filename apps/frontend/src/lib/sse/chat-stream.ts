import type { MessageRole } from "@/types";

export interface ChatHistoryItem {
  role: MessageRole;
  content: string;
}

export interface ChatStreamRequest {
  kbId: string;
  sessionId?: string;
  question: string;
  history?: ChatHistoryItem[];
}

export interface ChatStreamHandlers {
  onSession?: (payload: unknown) => void;
  onToken?: (token: string) => void;
  onSources?: (payload: unknown) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

interface SSEEvent {
  event: string;
  data: string;
}

function parseSSEEvent(chunk: string): SSEEvent | null {
  const lines = chunk.split("\n");
  let eventName = "message";
  const dataParts: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trimEnd();
    if (!line || line.startsWith(":")) continue;

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
      continue;
    }

    if (line.startsWith("data:")) {
      dataParts.push(line.slice(5).trimStart());
    }
  }

  if (dataParts.length === 0) return null;
  return {
    event: eventName,
    data: dataParts.join("\n"),
  };
}

export async function createChatStream(
  payload: ChatStreamRequest,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    const message = await response.text();
    throw new Error(message || "Failed to start chat stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let hasDoneEvent = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
    let separatorIndex = buffer.indexOf("\n\n");

    while (separatorIndex !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex);
      buffer = buffer.slice(separatorIndex + 2);
      separatorIndex = buffer.indexOf("\n\n");

      const parsed = parseSSEEvent(rawEvent);
      if (!parsed) continue;

      if (parsed.event === "token") {
        handlers.onToken?.(parsed.data);
        continue;
      }

      if (parsed.event === "session") {
        try {
          handlers.onSession?.(JSON.parse(parsed.data));
        } catch {
          handlers.onSession?.(null);
        }
        continue;
      }

      if (parsed.event === "sources") {
        try {
          handlers.onSources?.(JSON.parse(parsed.data));
        } catch {
          handlers.onSources?.([]);
        }
        continue;
      }

      if (parsed.event === "error") {
        handlers.onError?.(parsed.data || "Chat stream error.");
        return;
      }

      if (parsed.event === "done") {
        hasDoneEvent = true;
        handlers.onDone?.();
        return;
      }
    }
  }

  if (!hasDoneEvent) {
    handlers.onDone?.();
  }
}
