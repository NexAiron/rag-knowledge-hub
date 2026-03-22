export interface RetrievalResult {
  chunkId: string;
  content: string;
  score: number;
  documentId: string;
  page: number | null;
  metadata: Record<string, unknown> | null;
}
