import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeDocument } from "@/lib/server/mappers";

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

    return NextResponse.json({
      data: data.map(mapKnowledgeDocument),
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to fetch documents.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
