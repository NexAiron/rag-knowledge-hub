import { proxyToBackendResponse } from "@/lib/server/backend";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    kbId?: string;
    sessionId?: string;
    question?: string;
    topK?: number;
  };
  const response = await proxyToBackendResponse("/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      knowledgeBaseId: payload.kbId,
      conversationId: payload.sessionId,
      question: payload.question,
      topK: payload.topK,
    }),
  });

  if (!response.ok || !response.body) {
    return new Response(await response.text(), { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
