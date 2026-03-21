import type { KnowledgeDocument } from "@/types";

const documentsCollection: KnowledgeDocument[] = [
  {
    id: "doc-eng-1",
    kbId: "engineering-handbook",
    fileName: "deployment-guide.pdf",
    fileType: "pdf",
    size: 452003,
    status: "completed",
    createdAt: "2026-03-20T10:30:00.000Z",
    updatedAt: "2026-03-20T10:32:00.000Z",
  },
  {
    id: "doc-prod-1",
    kbId: "product-faq",
    fileName: "pricing-faq.md",
    fileType: "md",
    size: 3870,
    status: "processing",
    createdAt: "2026-03-21T02:00:00.000Z",
    updatedAt: "2026-03-21T02:00:00.000Z",
  },
];

function bumpProcessingDocuments() {
  const now = Date.now();
  for (let index = 0; index < documentsCollection.length; index += 1) {
    const current = documentsCollection[index];
    if (current.status !== "processing") continue;

    const elapsed = now - new Date(current.updatedAt).getTime();
    if (elapsed >= 8000) {
      documentsCollection[index] = {
        ...current,
        status: "completed",
        updatedAt: new Date(now).toISOString(),
      };
    }
  }
}

export function listDocuments(kbId?: string): KnowledgeDocument[] {
  bumpProcessingDocuments();
  const list = kbId
    ? documentsCollection.filter((item) => item.kbId === kbId)
    : documentsCollection;

  return [...list].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
  );
}

export function createDocument(payload: {
  kbId: string;
  fileName: string;
  fileType: "pdf" | "md";
  size: number;
}): KnowledgeDocument {
  const now = new Date().toISOString();
  const created: KnowledgeDocument = {
    id: `doc-${Date.now().toString(36)}`,
    kbId: payload.kbId,
    fileName: payload.fileName,
    fileType: payload.fileType,
    size: payload.size,
    status: "processing",
    createdAt: now,
    updatedAt: now,
  };

  documentsCollection.unshift(created);
  return created;
}

export function removeDocument(id: string): boolean {
  const index = documentsCollection.findIndex((item) => item.id === id);
  if (index < 0) return false;
  documentsCollection.splice(index, 1);
  return true;
}
