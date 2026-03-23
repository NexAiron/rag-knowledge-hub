import { proxyToBackend } from "@/lib/server/backend";
import { backendErrorResponse } from "@/lib/server/route-response";
import {
  BackendAuthResponse,
  createAuthSessionResponse,
} from "@/lib/server/auth-response";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  try {
    const data = await proxyToBackend<BackendAuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      skipAuth: true,
    });

    return createAuthSessionResponse(data);
  } catch (error) {
    return backendErrorResponse(error, "Register failed.", 400);
  }
}
