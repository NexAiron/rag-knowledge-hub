export interface ChatStreamHandlers {
  onMessage?: (token: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
  onSources?: (payload: unknown) => void;
}

export function createChatStream(
  url: string,
  handlers: ChatStreamHandlers,
): EventSource {
  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.addEventListener("token", (event) => {
    handlers.onMessage?.((event as MessageEvent).data);
  });

  eventSource.addEventListener("sources", (event) => {
    const payload = JSON.parse((event as MessageEvent).data);
    handlers.onSources?.(payload);
  });

  eventSource.addEventListener("done", () => {
    handlers.onDone?.();
    eventSource.close();
  });

  eventSource.addEventListener("error", () => {
    handlers.onError?.("SSE stream error");
    eventSource.close();
  });

  return eventSource;
}

