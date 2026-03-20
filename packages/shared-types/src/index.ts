export interface KnowledgeBaseSummary {
  id: string;
  name: string;
  description?: string;
}

export interface ChatChunkSource {
  chunkId: string;
  score: number;
  content: string;
  metadata?: Record<string, unknown>;
}

