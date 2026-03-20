import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "@nexairon/frontend",
    timestamp: new Date().toISOString(),
  });
}

