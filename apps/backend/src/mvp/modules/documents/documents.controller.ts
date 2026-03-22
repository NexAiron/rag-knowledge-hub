import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { extname, join } from "path";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RequestUser } from "../../common/types/request-user.type";
import { DocumentIdParamDto } from "./dto/document-id-param.dto";
import { ListDocumentsDto } from "./dto/list-documents.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { DocumentsService } from "./documents.service";

function ensureUploadDir(): string {
  const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
  const fullPath = join(process.cwd(), uploadDir);

  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }

  return fullPath;
}

const allowedExtensions = new Set([".pdf", ".md", ".markdown"]);
const allowedMimeTypes = new Set([
  "application/pdf",
  "text/markdown",
  "text/plain",
]);

function sanitizeBaseName(fileName: string): string {
  const ext = extname(fileName);
  const rawName = fileName.slice(0, fileName.length - ext.length);

  return rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "document";
}

function createStoredFilename(originalname: string): string {
  const ext = extname(originalname).toLowerCase();
  const baseName = sanitizeBaseName(originalname);
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${baseName}-${uniqueSuffix}${ext}`;
}

@UseGuards(JwtAuthGuard)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, ensureUploadDir());
        },
        filename: (_req, file, cb) => {
          cb(null, createStoredFilename(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const hasValidExtension = allowedExtensions.has(ext);
        const hasValidMimeType =
          allowedMimeTypes.has(file.mimetype) ||
          (ext === ".md" || ext === ".markdown");

        if (!hasValidExtension || !hasValidMimeType) {
          cb(
            new BadRequestException("Only PDF and Markdown files are supported"),
            false,
          );
          return;
        }

        cb(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.documentsService.upload(file, dto.kbId, user);
  }

  @Get()
  list(@Query() query: ListDocumentsDto, @CurrentUser() user: RequestUser) {
    return this.documentsService.listByKnowledgeBase(query.kbId, user.id);
  }

  @Delete(":id")
  remove(@Param() params: DocumentIdParamDto, @CurrentUser() user: RequestUser) {
    return this.documentsService.remove(params.id, user.id);
  }
}
