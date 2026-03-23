import type { KnowledgeBase } from "@/types";
import { requestData } from "@/lib/api/client";

export interface CreateKnowledgeBasePayload {
  name: string;
  description: string;
}

export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
  return requestData<KnowledgeBase[]>(
    "/api/kb",
    { method: "GET" },
    "Failed to fetch knowledge bases.",
  );
}

export async function createKnowledgeBase(
  payload: CreateKnowledgeBasePayload,
): Promise<KnowledgeBase> {
  return requestData<KnowledgeBase>(
    "/api/kb",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Failed to create knowledge base.",
  );
}
