const API_BASE_URL = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env?.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}
