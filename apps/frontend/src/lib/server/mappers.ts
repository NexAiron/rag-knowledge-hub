import type {
  BackendChatMessage,
  BackendChatSession,
  ChatMessage,
  ChatSession,
  KnowledgeBase,
  KnowledgeDocument,
} from "@/types";

interface BackendKnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  _count?: {
    documents?: number;
  };
}

interface BackendDocument {
  id: string;
  knowledgeBaseId: string;
  fileName: string;
  mimeType: string;
  size: number;
  status: "uploaded" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export function mapKnowledgeBase(
  kb: BackendKnowledgeBase,
): KnowledgeBase {
  return {
    id: kb.id,
    name: kb.name,
    description: kb.description ?? "",
    documentCount: kb._count?.documents ?? 0,
    updatedAt: kb.updatedAt,
  };
}

export function mapKnowledgeDocument(
  document: BackendDocument,
): KnowledgeDocument {
  return {
    id: document.id,
    kbId: document.knowledgeBaseId,
    fileName: document.fileName,
    fileType: document.mimeType.includes("pdf") ? "pdf" : "md",
    size: document.size,
    status: document.status,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export function mapChatSession(session: BackendChatSession): ChatSession {
  return {
    id: session.id,
    title: session.title ?? "New session",
    kbId: session.knowledgeBaseId,
    createdAt: new Date(session.createdAt).getTime(),
    updatedAt: new Date(session.updatedAt).getTime(),
  };
}

export function mapChatMessage(message: BackendChatMessage): ChatMessage {
  const citations = message.citations ?? message.sources ?? [];

  return {
    id: message.id,
    sessionId: message.conversationId,
    role: message.role,
    content: message.content,
    createdAt: new Date(message.createdAt).getTime(),
    sources: citations,
    citations,
    status: "done",
  };
}
