import { proxyToBackend } from "@/lib/server/backend";
import {
  backendErrorResponse,
  jsonAcknowledgement,
} from "@/lib/server/route-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    await proxyToBackend(`/conversations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    return jsonAcknowledgement("deleted");
  } catch (error) {
    return backendErrorResponse(error, "Failed to delete conversation.");
  }
}
