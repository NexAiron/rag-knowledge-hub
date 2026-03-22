export const EMBEDDING_PROVIDER = "EMBEDDING_PROVIDER";

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
}
