import { Injectable } from "@nestjs/common";
import { ParsedDocument, ParsedDocumentBlock } from "../interfaces/parsed-document.interface";
import { cleanText } from "../utils/text-cleaner";

@Injectable()
export class MarkdownParserService {
  parse(rawContent: string, fallbackTitle: string): ParsedDocument {
    const normalized = cleanText(rawContent);
    const title = this.extractTitle(normalized, fallbackTitle);
    const blocks = this.extractBlocks(normalized, title);

    return {
      title,
      content: blocks.map((block) => block.content).join("\n\n"),
      blocks,
    };
  }

  private extractTitle(content: string, fallbackTitle: string): string {
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    return heading || fallbackTitle;
  }

  private extractBlocks(content: string, title: string): ParsedDocumentBlock[] {
    if (!content) {
      return [];
    }

    const lines = content.split("\n");
    const blocks: ParsedDocumentBlock[] = [];
    let currentSection: string | null = title;
    let paragraphBuffer: string[] = [];
    let order = 0;

    const flushParagraph = () => {
      const paragraph = cleanText(paragraphBuffer.join("\n"));
      paragraphBuffer = [];

      if (!paragraph) {
        return;
      }

      blocks.push({
        title,
        content: paragraph,
        page: null,
        section: currentSection,
        order: order++,
      });
    };

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        flushParagraph();
        currentSection = cleanText(headingMatch[2]) || currentSection;
        continue;
      }

      if (!line.trim()) {
        flushParagraph();
        continue;
      }

      paragraphBuffer.push(line);
    }

    flushParagraph();

    return blocks;
  }
}
