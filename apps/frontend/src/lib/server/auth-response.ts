import { getAccessTokenCookieOptions } from "@/lib/server/backend";
import { jsonPayload } from "@/lib/server/route-response";

export interface BackendAuthUser {
  id: string;
  name: string | null;
  email: string;
}

export interface BackendAuthResponse {
  access_token: string;
  user: BackendAuthUser;
}

export function mapAuthUser(user: BackendAuthUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email.split("@")[0],
  };
}

export function createAuthSessionResponse(data: BackendAuthResponse) {
  const response = jsonPayload({
    token: data.access_token,
    user: mapAuthUser(data.user),
  });

  response.cookies.set(
    "access_token",
    data.access_token,
    getAccessTokenCookieOptions(),
  );

  return response;
}
