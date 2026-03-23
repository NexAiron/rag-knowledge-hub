interface ApiEnvelope<T> {
  data?: T;
  message?: string;
}

type JsonLike = Record<string, unknown>;

function buildHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);

  if (!nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  return nextHeaders;
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}

function resolveErrorMessage(
  response: Response,
  payload: JsonLike | ApiEnvelope<unknown> | null,
  fallbackMessage: string,
): string {
  if (payload && typeof payload.message === "string" && payload.message) {
    return payload.message;
  }

  return response.statusText || fallbackMessage;
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Request failed.",
): Promise<T> {
  const headers =
    init?.body instanceof FormData ? init.headers : buildHeaders(init?.headers);

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const payload = await parseJsonResponse<T & JsonLike>(response);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(response, payload, fallbackMessage));
  }

  if (payload === null) {
    throw new Error(fallbackMessage);
  }

  return payload;
}

export async function requestData<T>(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Request failed.",
): Promise<T> {
  const payload = await requestJson<ApiEnvelope<T> & JsonLike>(
    path,
    init,
    fallbackMessage,
  );

  if (payload.data === undefined) {
    throw new Error(payload.message ?? fallbackMessage);
  }

  return payload.data;
}

export async function requestVoid(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Request failed.",
): Promise<void> {
  await requestJson<JsonLike>(path, init, fallbackMessage);
}
