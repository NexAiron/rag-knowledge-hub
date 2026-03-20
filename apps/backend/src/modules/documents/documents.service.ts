import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentEntity } from "./entities/document.entity";

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
  ) {}

  async create(payload: CreateDocumentDto) {
    const doc = this.documentRepo.create({
      ...payload,
      status: "pending",
    });
    return this.documentRepo.save(doc);
  }

  async findByKb(kbId: string) {
    return this.documentRepo.find({
      where: { kbId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string) {
    const document = await this.documentRepo.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException("Document not found");
    }
    return document;
  }

  async updateStatus(
    id: string,
    status: "pending" | "processing" | "indexed" | "failed",
  ) {
    const document = await this.findOne(id);
    document.status = status;
    return this.documentRepo.save(document);
  }
}
