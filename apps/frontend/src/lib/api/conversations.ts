import type { ChatMessage, ChatSession } from "@/types";

export async function listConversations(kbId: string): Promise<ChatSession[]> {
  const response = await fetch(`/api/conversations?kbId=${encodeURIComponent(kbId)}`, {
    method: "GET",
    credentials: "include",
  });

  const json = (await response.json()) as { data?: ChatSession[]; message?: string };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to fetch conversations.");
  }

  return json.data;
}

export async function listConversationMessages(
  id: string,
): Promise<ChatMessage[]> {
  const response = await fetch(`/api/conversations/${encodeURIComponent(id)}/messages`, {
    method: "GET",
    credentials: "include",
  });

  const json = (await response.json()) as { data?: ChatMessage[]; message?: string };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to fetch conversation messages.");
  }

  return json.data;
}

export async function deleteConversation(id: string): Promise<void> {
  const response = await fetch(`/api/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const json = (await response.json()) as { message?: string };
    throw new Error(json.message ?? "Failed to delete conversation.");
  }
}
