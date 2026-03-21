import type { UserProfile } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export async function loginByPassword(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const json = (await response.json()) as
    | { message?: string }
    | (Partial<LoginResponse> & { message?: string });

  if (!response.ok || !("user" in json) || !("token" in json) || !json.user || !json.token) {
    throw new Error(json.message ?? "Login failed.");
  }

  return {
    user: json.user,
    token: json.token,
  };
}
