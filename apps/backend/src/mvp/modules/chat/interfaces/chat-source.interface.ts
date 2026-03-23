export interface ChatSource {
  chunkId: string;
  documentId: string;
  page: number | null;
  score: number;
  content: string;
}
