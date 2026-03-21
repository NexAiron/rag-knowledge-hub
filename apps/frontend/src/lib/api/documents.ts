import type { KnowledgeDocument } from "@/types";

export async function listDocuments(kbId: string): Promise<KnowledgeDocument[]> {
  const response = await fetch(`/api/documents?kbId=${encodeURIComponent(kbId)}`, {
    method: "GET",
    credentials: "include",
  });

  const json = (await response.json()) as {
    data?: KnowledgeDocument[];
    message?: string;
  };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to fetch documents.");
  }

  return json.data;
}

export async function uploadDocument(
  kbId: string,
  file: File,
): Promise<KnowledgeDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kbId", kbId);

  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const json = (await response.json()) as {
    data?: KnowledgeDocument;
    message?: string;
  };

  if (!response.ok || !json.data) {
    throw new Error(json.message ?? "Failed to upload document.");
  }

  return json.data;
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const json = (await response.json()) as { message?: string };
    throw new Error(json.message ?? "Failed to delete document.");
  }
}
