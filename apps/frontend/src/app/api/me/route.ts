import { NextResponse } from "next/server";
import { BackendProxyError, proxyToBackend } from "@/lib/server/backend";

interface BackendMeResponse {
  id: string;
  email: string;
  name: string | null;
}

export async function GET() {
  try {
    const data = await proxyToBackend<BackendMeResponse>("/auth/me");

    return NextResponse.json({
      user: {
        id: data.id,
        email: data.email,
        name: data.name ?? data.email.split("@")[0],
      },
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError ? error.message : "Unauthorized";

    return NextResponse.json({ message }, { status: 401 });
  }
}
