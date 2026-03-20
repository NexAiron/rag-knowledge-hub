import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() payload: CreateDocumentDto) {
    return this.documentsService.create(payload);
  }

  @Get("kb/:kbId")
  async findByKb(@Param("kbId") kbId: string) {
    return this.documentsService.findByKb(kbId);
  }
}

