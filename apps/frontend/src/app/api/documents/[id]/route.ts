import { NextResponse } from "next/server";
import { removeDocument } from "@/lib/mock/documents-db";

interface RouteContext {
  params: { id: string };
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  const success = removeDocument(params.id);
  if (!success) {
    return NextResponse.json(
      { message: "Document not found." },
      { status: 404 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
