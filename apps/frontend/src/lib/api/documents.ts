import type { KnowledgeDocument } from "@/types";
import { requestData, requestVoid } from "@/lib/api/client";

export async function listDocuments(kbId: string): Promise<KnowledgeDocument[]> {
  return requestData<KnowledgeDocument[]>(
    `/api/documents?kbId=${encodeURIComponent(kbId)}`,
    { method: "GET" },
    "Failed to fetch documents.",
  );
}

export async function uploadDocument(
  kbId: string,
  file: File,
): Promise<KnowledgeDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kbId", kbId);

  return requestData<KnowledgeDocument>(
    "/api/documents/upload",
    {
      method: "POST",
      body: formData,
    },
    "Failed to upload document.",
  );
}

export async function deleteDocument(id: string): Promise<void> {
  await requestVoid(
    `/api/documents/${id}`,
    { method: "DELETE" },
    "Failed to delete document.",
  );
}
