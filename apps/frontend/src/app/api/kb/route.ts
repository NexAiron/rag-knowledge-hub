import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeBase } from "@/lib/server/mappers";

export async function GET() {
  try {
    const data = await proxyToBackend<Array<{
      id: string;
      name: string;
      description: string | null;
      updatedAt: string;
      _count?: { documents?: number };
    }>>("/kb");

    return NextResponse.json({
      data: data.map(mapKnowledgeBase),
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to fetch knowledge bases.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    description?: string;
  };

  try {
    const data = await proxyToBackend<{
      id: string;
      name: string;
      description: string | null;
      updatedAt: string;
      _count?: { documents?: number };
    }>("/kb", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ data: mapKnowledgeBase(data) }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to create knowledge base.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
