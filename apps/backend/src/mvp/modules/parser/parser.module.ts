import { Module } from "@nestjs/common";
import { ParserService } from "./parser.service";
import { MarkdownParserService } from "./services/markdown-parser.service";
import { PdfParserService } from "./services/pdf-parser.service";

@Module({
  providers: [ParserService, MarkdownParserService, PdfParserService],
  exports: [ParserService],
})
export class ParserModule {}
