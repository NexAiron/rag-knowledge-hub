import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";
import { mapChatMessage } from "@/lib/server/mappers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const data = await proxyToBackend<
      Array<{
        id: string;
        conversationId: string;
        role: "user" | "assistant" | "system";
        content: string;
        createdAt: string;
        sources?: unknown;
      }>
    >(`/conversations/${encodeURIComponent(id)}/messages`);

    return NextResponse.json({
      data: data.map((message) =>
        mapChatMessage({
          ...message,
          sources: Array.isArray(message.sources) ? message.sources : [],
        }),
      ),
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to fetch conversation messages.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
