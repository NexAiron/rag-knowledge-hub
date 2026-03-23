import type { UserProfile } from "@/types";

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

export async function registerByPassword(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  const response = await fetch("/api/register", {
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
    throw new Error(json.message ?? "Register failed.");
  }

  return {
    user: json.user,
    token: json.token,
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const response = await fetch("/api/me", {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  const json = (await response.json()) as
    | { message?: string }
    | { user?: UserProfile; message?: string };

  if (!response.ok || !("user" in json) || !json.user) {
    throw new Error(json.message ?? "Failed to fetch current user.");
  }

  return json.user;
}

export async function updateCurrentUser(
  payload: UpdateProfilePayload,
): Promise<LoginResponse> {
  const response = await fetch("/api/me", {
    method: "PATCH",
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
    throw new Error(json.message ?? "Failed to update profile.");
  }

  return {
    user: json.user,
    token: json.token,
  };
}

export async function logoutSession(): Promise<void> {
  const response = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to log out.");
  }
}
