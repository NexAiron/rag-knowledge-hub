import { Injectable } from "@nestjs/common";
import { ChunkingOptions, ChunkOutput } from "./interfaces/chunk.interface";

@Injectable()
export class ChunkingService {
  splitText(text: string, options?: ChunkingOptions): ChunkOutput[] {
    const maxTokens =
      options?.maxTokens ?? Number(process.env.CHUNK_SIZE ?? 800);
    const overlapTokens =
      options?.overlapTokens ?? Number(process.env.CHUNK_OVERLAP ?? 100);
    const minTokens = Math.min(300, maxTokens);

    const segments = this.splitByHeadingAndParagraph(text);
    const chunks: ChunkOutput[] = [];

    let currentTokens: string[] = [];
    let currentSegmentIndexes: number[] = [];
    let chunkIndex = 0;

    const flushChunk = () => {
      if (currentTokens.length === 0) {
        return;
      }

      chunks.push({
        content: this.joinTokens(currentTokens),
        chunkIndex: chunkIndex++,
        tokenCount: currentTokens.length,
        metadata: {
          segmentIndexes: currentSegmentIndexes,
        },
      });

      const overlap = currentTokens.slice(-Math.min(overlapTokens, currentTokens.length));
      currentTokens = [...overlap];
      currentSegmentIndexes = [];
    };

    segments.forEach((segment, segmentIndex) => {
      const segmentTokens = this.tokenize(segment);
      if (segmentTokens.length === 0) {
        return;
      }

      const shouldAppend =
        currentTokens.length === 0 ||
        currentTokens.length + segmentTokens.length <= maxTokens ||
        currentTokens.length < minTokens;

      if (shouldAppend) {
        currentTokens.push(...segmentTokens);
        currentSegmentIndexes.push(segmentIndex);
        return;
      }

      flushChunk();
      currentTokens.push(...segmentTokens);
      currentSegmentIndexes.push(segmentIndex);
    });

    if (currentTokens.length > 0) {
      chunks.push({
        content: this.joinTokens(currentTokens),
        chunkIndex: chunkIndex++,
        tokenCount: currentTokens.length,
        metadata: {
          segmentIndexes: currentSegmentIndexes,
        },
      });
    }

    return chunks;
  }

  private splitByHeadingAndParagraph(text: string): string[] {
    const normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!normalized) {
      return [];
    }

    return normalized
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private tokenize(text: string): string[] {
    if (!text.trim()) {
      return [];
    }

    const hasWhitespace = /\s/.test(text);
    if (hasWhitespace) {
      return text.split(/\s+/).filter(Boolean);
    }

    // For text without spaces, fallback to char-level split.
    return Array.from(text);
  }

  private joinTokens(tokens: string[]): string {
    const content = tokens.join(" ");
    return content.replace(/\s{2,}/g, " ").trim();
  }
}
