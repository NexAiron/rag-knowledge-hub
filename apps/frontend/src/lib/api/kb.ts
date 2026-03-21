import type { KnowledgeBase } from "@/types";

export interface CreateKnowledgeBasePayload {
  name: string;
  description: string;
}

export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
  const response = await fetch("/api/kb", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const json = (await response.json()) as {
    data?: KnowledgeBase[];
    message?: string;
  };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to fetch knowledge bases.");
  }

  return json.data;
}

export async function createKnowledgeBase(
  payload: CreateKnowledgeBasePayload,
): Promise<KnowledgeBase> {
  const response = await fetch("/api/kb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const json = (await response.json()) as {
    data?: KnowledgeBase;
    message?: string;
  };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to create knowledge base.");
  }

  return json.data;
}
