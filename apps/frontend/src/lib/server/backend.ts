import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/routes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface BackendSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

interface BackendErrorResponse {
  success: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  timestamp?: string;
  path?: string;
}

export class BackendProxyError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown,
  ) {
    super(message);
  }
}

export function resolveApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  return API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
}

export async function proxyToBackendResponse(
  path: string,
  init?: RequestInit & { skipAuth?: boolean },
): Promise<Response> {
  const baseUrl = resolveApiBaseUrl();
  const cookieStore = await cookies();
  const accessToken = init?.skipAuth
    ? null
    : cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const headers = new Headers(init?.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function proxyToBackend<T>(
  path: string,
  init?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const response = await proxyToBackendResponse(path, init);

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? ((await response.json()) as unknown) : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as BackendErrorResponse).error?.message === "string"
        ? ((payload as BackendErrorResponse).error?.message ?? "Request to backend failed")
        : "Request to backend failed";

    throw new BackendProxyError(message, response.status, payload);
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as BackendSuccessResponse<T>).data;
  }

  return payload as T;
}

export async function clearAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", getAccessTokenCookieOptions(0));
}

export async function setAccessTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, getAccessTokenCookieOptions());
}

export function getAccessTokenCookieOptions(maxAge?: number) {
  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  } as const;

  if (typeof maxAge !== "number") {
    return options;
  }

  return {
    ...options,
    maxAge,
  } as const;
}
