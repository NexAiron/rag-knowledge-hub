import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MessageRole, Prisma } from "@prisma/client";
import { KbService } from "../kb/kb.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kbService: KbService,
  ) {}

  async list(userId: string, kbId: string) {
    await this.kbService.ensureOwner(kbId, userId);
    return this.prisma.conversation.findMany({
      where: {
        userId,
        knowledgeBaseId: kbId,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException("No permission to access this conversation");
    }

    return conversation.messages;
  }

  async listRecentMessages(conversationId: string, userId: string, limit = 12) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException("No permission to access this conversation");
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        role: true,
        content: true,
      },
    });

    return messages.reverse();
  }

  async delete(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }
    if (conversation.userId !== userId) {
      throw new ForbiddenException("No permission to delete this conversation");
    }

    await this.prisma.conversation.delete({ where: { id: conversationId } });
    return { deleted: true };
  }

  async ensureConversation(params: {
    userId: string;
    knowledgeBaseId: string;
    conversationId?: string;
    firstQuestion?: string;
  }) {
    const { userId, knowledgeBaseId, conversationId, firstQuestion } = params;
    await this.kbService.ensureOwner(knowledgeBaseId, userId);

    if (conversationId) {
      const existing = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!existing) {
        throw new NotFoundException("Conversation not found");
      }
      if (existing.userId !== userId) {
        throw new ForbiddenException("No permission to access this conversation");
      }
      if (existing.knowledgeBaseId !== knowledgeBaseId) {
        throw new ForbiddenException(
          "Conversation does not belong to this knowledge base",
        );
      }
      return existing;
    }

    const title = this.generateTitle(firstQuestion ?? "New session");
    return this.prisma.conversation.create({
      data: {
        userId,
        knowledgeBaseId,
        title,
      },
    });
  }

  createMessage(input: {
    conversationId: string;
    role: MessageRole;
    content: string;
    sources?: unknown;
  }) {
    return this.prisma.message.create({
      data: {
        conversationId: input.conversationId,
        role: input.role,
        content: input.content,
        sources:
          input.sources === undefined
            ? undefined
            : (input.sources as Prisma.InputJsonValue),
      },
    });
  }

  touchConversation(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  private generateTitle(question: string): string {
    const normalized = question.trim().replace(/\s+/g, " ");
    if (!normalized) {
      return "New session";
    }
    return normalized.slice(0, 30);
  }
}
