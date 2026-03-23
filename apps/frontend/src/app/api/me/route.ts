import {
  BackendProxyError,
  proxyToBackend,
} from "@/lib/server/backend";
import {
  BackendAuthResponse,
  createAuthSessionResponse,
  mapAuthUser,
} from "@/lib/server/auth-response";
import {
  backendErrorResponse,
  jsonPayload,
  unauthorizedResponse,
} from "@/lib/server/route-response";

interface BackendMeResponse {
  id: string;
  email: string;
  name: string | null;
}

export async function GET() {
  try {
    const data = await proxyToBackend<BackendMeResponse>("/auth/me");

    return jsonPayload({
      user: mapAuthUser(data),
    });
  } catch (error) {
    const message =
      error instanceof BackendProxyError ? error.message : "Unauthorized";
    return unauthorizedResponse(message);
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
  };

  try {
    const data = await proxyToBackend<BackendAuthResponse>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return createAuthSessionResponse(data);
  } catch (error) {
    return backendErrorResponse(error, "Failed to update profile.", 400);
  }
}
