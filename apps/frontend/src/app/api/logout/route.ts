import { NextResponse } from "next/server";
import { clearAccessTokenCookie } from "@/lib/server/backend";

export async function POST() {
  await clearAccessTokenCookie();

  return NextResponse.json({ success: true });
}
