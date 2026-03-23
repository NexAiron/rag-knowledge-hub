import { proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeDocument } from "@/lib/server/mappers";
import { backendErrorResponse, jsonData } from "@/lib/server/route-response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kbId = url.searchParams.get("kbId") ?? "";

  try {
    const data = await proxyToBackend<Array<{
      id: string;
      knowledgeBaseId: string;
      fileName: string;
      mimeType: string;
      size: number;
      status: "uploaded" | "processing" | "completed" | "failed";
      createdAt: string;
      updatedAt: string;
    }>>(`/documents?kbId=${encodeURIComponent(kbId)}`);

    return jsonData(data.map(mapKnowledgeDocument));
  } catch (error) {
    return backendErrorResponse(error, "Failed to fetch documents.");
  }
}
