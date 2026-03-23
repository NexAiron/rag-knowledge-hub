import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/routes";
import {
  BackendProxyError,
  getAccessTokenCookieOptions,
} from "@/lib/server/backend";

export function jsonData<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function jsonPayload<T extends Record<string, unknown>>(
  payload: T,
  init?: ResponseInit,
) {
  return NextResponse.json(payload, init);
}

export function jsonAcknowledgement(
  key: string = "success",
  init?: ResponseInit,
) {
  return jsonPayload({ [key]: true }, init);
}

export function backendErrorResponse(
  error: unknown,
  fallbackMessage: string,
  fallbackStatus = 500,
) {
  const message =
    error instanceof BackendProxyError ? error.message : fallbackMessage;
  const status =
    error instanceof BackendProxyError ? error.status : fallbackStatus;

  return NextResponse.json({ message }, { status });
}

export function unauthorizedResponse(message = "Unauthorized") {
  const response = NextResponse.json({ message }, { status: 401 });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", getAccessTokenCookieOptions(0));
  return response;
}
