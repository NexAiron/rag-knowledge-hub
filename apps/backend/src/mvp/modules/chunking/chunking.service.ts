import { Injectable } from "@nestjs/common";
import { ParsedDocument } from "../parser/interfaces/parsed-document.interface";
import {
  ChunkingOptions,
  ChunkOutput,
  ChunkSegmentInput,
} from "./interfaces/chunk.interface";

@Injectable()
export class ChunkingService {
  splitText(text: string, options?: ChunkingOptions): ChunkOutput[] {
    const segments = this.splitByHeadingAndParagraph(text).map((content) => ({
      content,
      page: null,
      section: null,
    }));

    return this.splitSegments(segments, options);
  }

  splitParsedDocument(
    parsedDocument: ParsedDocument,
    options?: ChunkingOptions,
  ): ChunkOutput[] {
    return this.splitSegments(
      parsedDocument.blocks.map((block) => ({
        content: block.content,
        page: block.page ?? null,
        section: block.section ?? null,
        order: block.order,
        title: block.title,
      })),
      options,
    );
  }

  private splitSegments(
    segments: ChunkSegmentInput[],
    options?: ChunkingOptions,
  ): ChunkOutput[] {
    const maxTokens =
      options?.maxTokens ?? Number(process.env.CHUNK_SIZE ?? 800);
    const overlapTokens =
      options?.overlapTokens ?? Number(process.env.CHUNK_OVERLAP ?? 100);
    const minTokens = Math.min(300, maxTokens);
    const chunks: ChunkOutput[] = [];

    let currentTokens: string[] = [];
    let currentSegments: ChunkSegmentInput[] = [];
    let chunkIndex = 0;

    const flushChunk = () => {
      if (currentTokens.length === 0) {
        return;
      }

      const firstSegment = currentSegments[0];
      const lastSegment = currentSegments[currentSegments.length - 1];

      chunks.push({
        content: this.joinTokens(currentTokens),
        chunkIndex: chunkIndex++,
        tokenCount: currentTokens.length,
        page: firstSegment?.page ?? null,
        metadata: {
          segmentCount: currentSegments.length,
          startOrder: firstSegment?.order ?? null,
          endOrder: lastSegment?.order ?? null,
          section: firstSegment?.section ?? null,
          title: firstSegment?.title ?? null,
          pages: Array.from(
            new Set(
              currentSegments
                .map((segment) => segment.page)
                .filter((page): page is number => typeof page === "number"),
            ),
          ),
        },
      });

      const overlap = currentTokens.slice(-Math.min(overlapTokens, currentTokens.length));
      currentTokens = [...overlap];
      currentSegments = [];
    };

    segments.forEach((segment) => {
      const segmentTokens = this.tokenize(segment.content);
      if (segmentTokens.length === 0) {
        return;
      }

      const shouldAppend =
        currentTokens.length === 0 ||
        currentTokens.length + segmentTokens.length <= maxTokens ||
        currentTokens.length < minTokens;

      if (shouldAppend) {
        currentTokens.push(...segmentTokens);
        currentSegments.push(segment);
        return;
      }

      flushChunk();
      currentTokens.push(...segmentTokens);
      currentSegments.push(segment);
    });

    if (currentTokens.length > 0) {
      const firstSegment = currentSegments[0];
      const lastSegment = currentSegments[currentSegments.length - 1];

      chunks.push({
        content: this.joinTokens(currentTokens),
        chunkIndex: chunkIndex++,
        tokenCount: currentTokens.length,
        page: firstSegment?.page ?? null,
        metadata: {
          segmentCount: currentSegments.length,
          startOrder: firstSegment?.order ?? null,
          endOrder: lastSegment?.order ?? null,
          section: firstSegment?.section ?? null,
          title: firstSegment?.title ?? null,
          pages: Array.from(
            new Set(
              currentSegments
                .map((segment) => segment.page)
                .filter((page): page is number => typeof page === "number"),
            ),
          ),
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
