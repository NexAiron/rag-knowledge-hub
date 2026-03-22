import { NextResponse } from "next/server";
import {
  BackendProxyError,
  proxyToBackend,
  setAccessTokenCookie,
} from "@/lib/server/backend";

interface BackendAuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  try {
    const data = await proxyToBackend<BackendAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      skipAuth: true,
    });

    await setAccessTokenCookie(data.access_token);

    return NextResponse.json({
      token: data.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name ?? data.user.email.split("@")[0],
      },
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError ? error.message : "Login failed.";

    return NextResponse.json({ message }, { status: 401 });
  }
}
