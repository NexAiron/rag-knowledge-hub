import { Injectable } from "@nestjs/common";
import * as pdfParse from "pdf-parse";
import { ParsedDocument, ParsedDocumentBlock } from "../interfaces/parsed-document.interface";
import { cleanText } from "../utils/text-cleaner";

const PAGE_MARKER_PREFIX = "__NEXAIRON_PAGE__";

@Injectable()
export class PdfParserService {
  async parse(buffer: Buffer, fallbackTitle: string): Promise<ParsedDocument> {
    let pageNumber = 0;

    const parsed = await pdfParse(buffer, {
      pagerender: async (pageData) => {
        pageNumber += 1;

        const textContent = await pageData.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");

        return `\n${PAGE_MARKER_PREFIX}${pageNumber}\n${pageText}\n`;
      },
    });

    const blocks = this.extractBlocks(parsed.text ?? "", fallbackTitle);

    return {
      title: fallbackTitle,
      content: blocks.map((block) => block.content).join("\n\n"),
      blocks,
    };
  }

  private extractBlocks(content: string, title: string): ParsedDocumentBlock[] {
    const rawPages = content.split(new RegExp(`\\n${PAGE_MARKER_PREFIX}`)).filter(Boolean);
    const blocks: ParsedDocumentBlock[] = [];
    let order = 0;

    rawPages.forEach((rawPage) => {
      const [pageHeader, ...rest] = rawPage.split("\n");
      const page = Number.parseInt(pageHeader.trim(), 10);
      const pageText = cleanText(rest.join("\n"));

      if (!pageText) {
        return;
      }

      const paragraphs = pageText.split(/\n{2,}/).map((item) => cleanText(item)).filter(Boolean);

      paragraphs.forEach((paragraph) => {
        blocks.push({
          title,
          content: paragraph,
          page: Number.isFinite(page) ? page : null,
          section: null,
          order: order++,
        });
      });
    });

    return blocks;
  }
}
