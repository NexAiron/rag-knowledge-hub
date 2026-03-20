import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentStatusDto } from "./dto/update-document-status.dto";
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

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() payload: UpdateDocumentStatusDto,
  ) {
    return this.documentsService.updateStatus(id, payload.status);
  }
}
