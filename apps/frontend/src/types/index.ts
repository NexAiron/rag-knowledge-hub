export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  updatedAt: string;
}

export interface SourceChunk {
  id?: string;
  doc?: string;
  content?: string;
  page?: string | number;
  title?: string;
  snippet?: string;
  score?: number;
  uri?: string;
}

export type DocumentStatus =
  | "uploading"
  | "processing"
  | "completed"
  | "failed";

export interface KnowledgeDocument {
  id: string;
  kbId: string;
  fileName: string;
  fileType: "pdf" | "md";
  size: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatSession {
  id: string;
  title: string;
  kbId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  sources: SourceChunk[];
  status: "streaming" | "done" | "error";
}
