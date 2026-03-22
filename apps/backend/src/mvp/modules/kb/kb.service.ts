import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateKbDto } from "./dto/create-kb.dto";

const kbListSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      documents: true,
      conversations: true,
    },
  },
} satisfies Prisma.KnowledgeBaseSelect;

const kbDetailInclude = {
  _count: {
    select: {
      documents: true,
      chunks: true,
      conversations: true,
    },
  },
} satisfies Prisma.KnowledgeBaseInclude;

@Injectable()
export class KbService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateKbDto) {
    return this.prisma.knowledgeBase.create({
      data: {
        userId,
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
      },
      select: kbListSelect,
    });
  }

  list(userId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: kbListSelect,
    });
  }

  async detail(id: string, userId: string) {
    return this.ensureOwner(id, userId, kbDetailInclude);
  }

  async remove(id: string, userId: string) {
    await this.ensureOwner(id, userId);

    await this.prisma.knowledgeBase.delete({ where: { id } });
    return { id, deleted: true };
  }

  async ensureOwner<T extends Prisma.KnowledgeBaseInclude | undefined>(
    id: string,
    userId: string,
    include?: T,
  ) {
    const kb = await this.prisma.knowledgeBase.findUnique({
      where: { id },
      include,
    });

    if (!kb) {
      throw new NotFoundException("Knowledge base not found");
    }
    if (kb.userId !== userId) {
      throw new ForbiddenException("No permission to access this knowledge base");
    }
    return kb;
  }
}
