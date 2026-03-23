import { proxyToBackend } from "@/lib/server/backend";
import { mapChatMessage } from "@/lib/server/mappers";
import { backendErrorResponse, jsonData } from "@/lib/server/route-response";

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
        citations?: unknown;
      }>
    >(`/conversations/${encodeURIComponent(id)}/messages`);

    return jsonData(
      data.map((message) =>
        mapChatMessage({
          ...message,
          sources: Array.isArray(message.sources) ? message.sources : [],
          citations: Array.isArray(message.citations) ? message.citations : [],
        }),
      ),
    );
  } catch (error) {
    return backendErrorResponse(error, "Failed to fetch conversation messages.");
  }
}
