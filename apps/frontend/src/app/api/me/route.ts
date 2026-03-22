import { NextResponse } from "next/server";
import {
  BackendProxyError,
  getAccessTokenCookieOptions,
  proxyToBackend,
} from "@/lib/server/backend";

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

interface BackendUpdateMeResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
  };

  try {
    const data = await proxyToBackend<BackendUpdateMeResponse>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = NextResponse.json({
      token: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name ?? data.user.email.split("@")[0],
      },
    });

    response.cookies.set(
      "access_token",
      data.access_token,
      getAccessTokenCookieOptions(),
    );

    return response;
  } catch (error) {
    const message =
      error instanceof BackendProxyError ? error.message : "Failed to update profile.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
