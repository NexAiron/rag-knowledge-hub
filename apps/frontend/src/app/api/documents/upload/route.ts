import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeDocument } from "@/lib/server/mappers";

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

    return NextResponse.json({ data: mapKnowledgeDocument(data) }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to upload document.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
