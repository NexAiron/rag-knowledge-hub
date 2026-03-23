import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";
import { mapChatSession } from "@/lib/server/mappers";

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

    return NextResponse.json({
      data: data.map(mapChatSession),
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to fetch conversations.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
