import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { MessageRole } from "@prisma/client";
import { LlmService } from "../llm/llm.service";
import { RetrievalService } from "../retrieval/retrieval.service";
import { ConversationsService } from "../conversations/conversations.service";
import { PrismaService } from "../../prisma/prisma.service";

interface StreamChatInput {
  userId: string;
  knowledgeBaseId: string;
  conversationId?: string;
  question: string;
}

interface ChatSource {
  id: string;
  doc: string;
  title: string;
  content: string;
  snippet: string;
  page?: string;
  score: number;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly retrievalService: RetrievalService,
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  async streamToResponse(input: StreamChatInput, response: Response) {
    const question = input.question.trim();
    const conversation = await this.conversationsService.ensureConversation({
      userId: input.userId,
      knowledgeBaseId: input.knowledgeBaseId,
      conversationId: input.conversationId,
      firstQuestion: question,
    });

    await this.conversationsService.createMessage({
      conversationId: conversation.id,
      role: MessageRole.user,
      content: question,
    });

    const retrieval = await this.retrievalService.retrieve({
      knowledgeBaseId: input.knowledgeBaseId,
      query: question,
    });

    const sources = await this.buildSources(retrieval);

    this.writeEvent(response, "session", {
      id: conversation.id,
      kbId: conversation.knowledgeBaseId,
      title: conversation.title ?? question.slice(0, 30),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    });
    this.writeEvent(response, "sources", sources);

    const prompt = this.buildPrompt(question, sources);
    let answer = "";

    for await (const token of this.llmService.stream(prompt)) {
      answer += token;
      this.writeEvent(response, "token", token);
    }

    await this.conversationsService.createMessage({
      conversationId: conversation.id,
      role: MessageRole.assistant,
      content: answer,
      sources,
    });
    await this.conversationsService.touchConversation(conversation.id);

    this.writeEvent(response, "done", {
      conversationId: conversation.id,
    });
    response.end();
  }

  private async buildSources(
    retrieval: Awaited<ReturnType<RetrievalService["retrieve"]>>,
  ): Promise<ChatSource[]> {
    const documentIds = [...new Set(retrieval.map((item) => item.documentId))];
    const documents = documentIds.length
      ? await this.prisma.document.findMany({
          where: { id: { in: documentIds } },
          select: {
            id: true,
            title: true,
            fileName: true,
          },
        })
      : [];

    const documentMap = new Map(
      documents.map((document) => [
        document.id,
        document.title || document.fileName || "Unknown document",
      ]),
    );

    return retrieval.map((item) => ({
      id: item.chunkId,
      doc: documentMap.get(item.documentId) ?? "Unknown document",
      title: documentMap.get(item.documentId) ?? "Unknown document",
      content: item.content,
      snippet: item.content,
      page: item.page === null ? undefined : String(item.page),
      score: item.score,
    }));
  }

  private buildPrompt(question: string, sources: ChatSource[]): string {
    const sourceBlock =
      sources.length > 0
        ? sources
            .map(
              (source, index) =>
                `[${index + 1}] ${source.title}\n${source.snippet}`,
            )
            .join("\n\n")
        : "No indexed sources were found for this question.";

    return [
      "You are answering based on the current knowledge base.",
      "Keep the answer concise and grounded in the retrieved content.",
      `Question: ${question}`,
      "",
      "Sources:",
      sourceBlock,
    ].join("\n");
  }

  private writeEvent(response: Response, event: string, payload: unknown) {
    response.write(`event: ${event}\n`);
    response.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}
