import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DocumentStatus, Prisma } from "@prisma/client";
import { unlink } from "fs/promises";
import { basename, extname } from "path";
import { KbService } from "../kb/kb.service";
import { RequestUser } from "../../common/types/request-user.type";
import { PrismaService } from "../../prisma/prisma.service";
import { IngestionService } from "../ingestion/ingestion.service";

const documentListSelect = {
  id: true,
  knowledgeBaseId: true,
  title: true,
  fileName: true,
  filePath: true,
  mimeType: true,
  size: true,
  status: true,
  errorMessage: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DocumentSelect;

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kbService: KbService,
    private readonly ingestionService: IngestionService,
  ) {}

  async upload(
    file: Express.Multer.File | undefined,
    kbId: string,
    user: RequestUser,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    await this.kbService.ensureOwner(kbId, user.id);

    const document = await this.prisma.document.create({
      data: {
        knowledgeBaseId: kbId,
        title: this.toTitle(file.originalname),
        fileName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        size: file.size,
        status: DocumentStatus.uploaded,
      },
      select: documentListSelect,
    });

    // Save metadata first with uploaded status, then start async ingestion.
    void this.ingestionService.ingestDocument(document.id).catch(() => undefined);

    return document;
  }

  async listByKnowledgeBase(kbId: string, userId: string) {
    await this.kbService.ensureOwner(kbId, userId);
    return this.prisma.document.findMany({
      where: { knowledgeBaseId: kbId },
      orderBy: { createdAt: "desc" },
      select: documentListSelect,
    });
  }

  async remove(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { knowledgeBase: true },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    if (document.knowledgeBase.userId !== userId) {
      throw new ForbiddenException("No permission to delete this document");
    }

    await this.prisma.$transaction([
      this.prisma.chunk.deleteMany({ where: { documentId } }),
      this.prisma.document.delete({ where: { id: documentId } }),
    ]);

    await unlink(document.filePath).catch(() => undefined);

    return { id: documentId, deleted: true };
  }

  private toTitle(filename: string): string {
    const ext = extname(filename);
    return basename(filename, ext);
  }
}
