import { proxyToBackend } from "@/lib/server/backend";
import { mapKnowledgeBase } from "@/lib/server/mappers";
import { backendErrorResponse, jsonData } from "@/lib/server/route-response";

export async function GET() {
  try {
    const data = await proxyToBackend<Array<{
      id: string;
      name: string;
      description: string | null;
      updatedAt: string;
      _count?: { documents?: number };
    }>>("/kb");

    return jsonData(data.map(mapKnowledgeBase));
  } catch (error) {
    return backendErrorResponse(error, "Failed to fetch knowledge bases.");
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

    return jsonData(mapKnowledgeBase(data), { status: 201 });
  } catch (error) {
    return backendErrorResponse(error, "Failed to create knowledge base.");
  }
}
