import { Injectable } from "@nestjs/common";
import { readFile } from "fs/promises";
import { extname } from "path";
import { DocumentParserException } from "./exceptions/document-parser.exception";
import { ParsedDocument } from "./interfaces/parsed-document.interface";
import { MarkdownParserService } from "./services/markdown-parser.service";
import { PdfParserService } from "./services/pdf-parser.service";

@Injectable()
export class ParserService {
  constructor(
    private readonly markdownParserService: MarkdownParserService,
    private readonly pdfParserService: PdfParserService,
  ) {}

  async parseFile(params: {
    filePath: string;
    mimeType: string;
    title: string;
  }): Promise<ParsedDocument> {
    const { filePath, mimeType, title } = params;
    const extension = extname(filePath).toLowerCase();
    const buffer = await readFile(filePath);

    try {
      if (mimeType.includes("pdf") || extension === ".pdf") {
        return await this.pdfParserService.parse(buffer, title);
      }

      if (
        extension === ".md" ||
        extension === ".markdown" ||
        mimeType.includes("markdown") ||
        mimeType.startsWith("text/")
      ) {
        return this.markdownParserService.parse(buffer.toString("utf-8"), title);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown parser error";
      throw new DocumentParserException(message);
    }

    throw new DocumentParserException("Unsupported document type");
  }
}
