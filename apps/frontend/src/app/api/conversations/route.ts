import { proxyToBackend } from "@/lib/server/backend";
import { mapChatSession } from "@/lib/server/mappers";
import { backendErrorResponse, jsonData } from "@/lib/server/route-response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kbId = url.searchParams.get("kbId") ?? "";

  try {
    const data = await proxyToBackend<
      Array<{
        id: string;
        title: string | null;
        knowledgeBaseId: string;
        createdAt: string;
        updatedAt: string;
      }>
    >(`/conversations?kbId=${encodeURIComponent(kbId)}`);

    return jsonData(data.map(mapChatSession));
  } catch (error) {
    return backendErrorResponse(error, "Failed to fetch conversations.");
  }
}
