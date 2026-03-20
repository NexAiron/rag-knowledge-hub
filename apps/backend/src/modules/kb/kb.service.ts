import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateKbDto } from "./dto/create-kb.dto";
import { ListKbDto } from "./dto/list-kb.dto";
import { UpdateKbDto } from "./dto/update-kb.dto";
import { KnowledgeBaseEntity } from "./entities/knowledge-base.entity";

@Injectable()
export class KbService {
  constructor(
    @InjectRepository(KnowledgeBaseEntity)
    private readonly kbRepo: Repository<KnowledgeBaseEntity>,
  ) {}

  async create(dto: CreateKbDto) {
    const entity = this.kbRepo.create({
      ...dto,
      ownerId: "demo-user",
      isEnabled: true,
    });
    return this.kbRepo.save(entity);
  }

  async findAll(query: ListKbDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const qb = this.kbRepo
      .createQueryBuilder("kb")
      .orderBy("kb.createdAt", "DESC")
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (query.keyword) {
      qb.andWhere("kb.name LIKE :keyword OR kb.description LIKE :keyword", {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.isEnabled !== undefined) {
      qb.andWhere("kb.isEnabled = :isEnabled", { isEnabled: query.isEnabled });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const kb = await this.kbRepo.findOne({ where: { id } });
    if (!kb) {
      throw new NotFoundException("Knowledge base not found");
    }
    return kb;
  }

  async update(id: string, dto: UpdateKbDto) {
    const kb = await this.findOne(id);
    Object.assign(kb, dto);
    return this.kbRepo.save(kb);
  }

  async remove(id: string) {
    const kb = await this.findOne(id);
    await this.kbRepo.remove(kb);
    return { id, deleted: true };
  }

  async setEnabled(id: string, isEnabled: boolean) {
    const kb = await this.findOne(id);
    kb.isEnabled = isEnabled;
    return this.kbRepo.save(kb);
  }
}
