import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  const { id } = await params;

  try {
    await proxyToBackend(`/documents/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message =
      error instanceof BackendProxyError
        ? error.message
        : "Failed to delete document.";
    const status = error instanceof BackendProxyError ? error.status : 500;

    return NextResponse.json({ message }, { status });
  }
}
