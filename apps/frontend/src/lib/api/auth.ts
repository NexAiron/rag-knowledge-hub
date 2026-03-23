import type { UserProfile } from "@/types";
import { requestJson, requestVoid } from "@/lib/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateProfilePayload {
  email?: string;
  name?: string;
}

async function requestAuthSession(
  path: string,
  method: "POST" | "PATCH",
  payload: LoginPayload | RegisterPayload | UpdateProfilePayload,
  fallbackMessage: string,
): Promise<LoginResponse> {
  const json = await requestJson<
    | { message?: string }
    | (Partial<LoginResponse> & { message?: string })
  >(
    path,
    {
      method,
      body: JSON.stringify(payload),
    },
    fallbackMessage,
  );

  if (!("user" in json) || !("token" in json) || !json.user || !json.token) {
    throw new Error(json.message ?? fallbackMessage);
  }

  return {
    user: json.user,
    token: json.token,
  };
}

export async function loginByPassword(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return requestAuthSession("/api/login", "POST", payload, "Login failed.");
}

export async function registerByPassword(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  return requestAuthSession(
    "/api/register",
    "POST",
    payload,
    "Register failed.",
  );
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const json = await requestJson<
      | { message?: string }
      | { user?: UserProfile; message?: string }
    >(
      "/api/me",
      { method: "GET" },
      "Failed to fetch current user.",
    );

    if (!("user" in json) || !json.user) {
      throw new Error(json.message ?? "Failed to fetch current user.");
    }

    return json.user;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return null;
    }

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unauthorized")
    ) {
      return null;
    }

    throw error;
  }
}

export async function updateCurrentUser(
  payload: UpdateProfilePayload,
): Promise<LoginResponse> {
  return requestAuthSession(
    "/api/me",
    "PATCH",
    payload,
    "Failed to update profile.",
  );
}

export async function logoutSession(): Promise<void> {
  await requestVoid("/api/logout", { method: "POST" }, "Failed to log out.");
}
