export interface ChunkOutput {
  content: string;
  chunkIndex: number;
  tokenCount: number;
  page?: number | null;
  metadata?: Record<string, unknown>;
}

export interface ChunkingOptions {
  maxTokens?: number;
  overlapTokens?: number;
}
