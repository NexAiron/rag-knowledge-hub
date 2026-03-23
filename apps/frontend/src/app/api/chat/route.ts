import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ACCESS_TOKEN_COOKIE = "access_token";

function resolveApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  return API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    kbId?: string;
    sessionId?: string;
    question?: string;
  };
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(`${resolveApiBaseUrl()}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      knowledgeBaseId: payload.kbId,
      conversationId: payload.sessionId,
      question: payload.question,
    }),
    cache: "no-store",
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
