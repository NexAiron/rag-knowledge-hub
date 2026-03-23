import { Injectable } from "@nestjs/common";
import { EmbeddingProvider } from "./embedding-provider.interface";

@Injectable()
export class MockEmbeddingProvider implements EmbeddingProvider {
  async embed(texts: string[]): Promise<number[][]> {
    const dimension = Number(process.env.EMBEDDING_DIMENSION ?? 256);
    return texts.map((text) => this.buildEmbedding(text, dimension));
  }

  private buildEmbedding(text: string, dimension: number): number[] {
    const vector = new Array<number>(dimension).fill(0);
    const chars = Array.from(text);

    chars.forEach((char, index) => {
      const code = char.codePointAt(0) ?? 0;
      const pos = index % dimension;
      vector[pos] += (code % 127) / 127;
    });

    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    if (!norm) {
      return vector;
    }

    return vector.map((value) => value / norm);
  }
}
