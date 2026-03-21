import { NextResponse } from "next/server";
import { listDocuments } from "@/lib/mock/documents-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kbId = url.searchParams.get("kbId") ?? undefined;

  return NextResponse.json({
    data: listDocuments(kbId),
  });
}
