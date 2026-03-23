import type { ChatMessage, ChatSession } from "@/types";
import { requestData, requestVoid } from "@/lib/api/client";

export async function listConversations(kbId: string): Promise<ChatSession[]> {
  return requestData<ChatSession[]>(
    `/api/conversations?kbId=${encodeURIComponent(kbId)}`,
    { method: "GET" },
    "Failed to fetch conversations.",
  );
}

export async function listConversationMessages(
  id: string,
): Promise<ChatMessage[]> {
  return requestData<ChatMessage[]>(
    `/api/conversations/${encodeURIComponent(id)}/messages`,
    { method: "GET" },
    "Failed to fetch conversation messages.",
  );
}

export async function deleteConversation(id: string): Promise<void> {
  await requestVoid(
    `/api/conversations/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "Failed to delete conversation.",
  );
}
