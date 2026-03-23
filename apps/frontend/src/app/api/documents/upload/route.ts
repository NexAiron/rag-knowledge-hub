import { proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeDocument } from "@/lib/server/mappers";
import { backendErrorResponse, jsonData } from "@/lib/server/route-response";

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const data = await proxyToBackend<{
      id: string;
      knowledgeBaseId: string;
      fileName: string;
      mimeType: string;
      size: number;
      status: "uploaded" | "processing" | "completed" | "failed";
      createdAt: string;
      updatedAt: string;
    }>("/documents/upload", {
      method: "POST",
      body: formData,
    });

    return jsonData(mapKnowledgeDocument(data), { status: 201 });
  } catch (error) {
    return backendErrorResponse(error, "Failed to upload document.");
  }
}
