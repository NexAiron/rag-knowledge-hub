import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { MessageRole } from "@prisma/client";
import { LlmService } from "../llm/llm.service";
import { LlmMessage } from "../llm/providers/llm-provider.interface";
import { RetrievalService } from "../retrieval/retrieval.service";
import { ConversationsService } from "../conversations/conversations.service";
import { PrismaService } from "../../prisma/prisma.service";

interface StreamChatInput {
  userId: string;
  knowledgeBaseId: string;
  conversationId?: string;
  question: string;
  topK?: number;
}

export interface ChatSource {
  id: string;
  doc: string;
  title: string;
  content: string;
  snippet: string;
  page?: string;
  score: number;
}

export interface ChatAskResponse {
  conversationId: string;
  answer: string;
  sources: ChatSource[];
  citations: ChatSource[];
}

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly retrievalService: RetrievalService,
    private readonly llmService: LlmService,
    private readonly prisma: PrismaService,
  ) {}

  async ask(input: StreamChatInput): Promise<ChatAskResponse> {
    const prepared = await this.prepareChat(input);
    const answer = prepared.answer ?? (await this.llmService.complete(prepared.messages));

    await this.conversationsService.createMessage({
      conversationId: prepared.conversation.id,
      role: MessageRole.assistant,
      content: answer,
      sources: prepared.sources,
    });
    await this.conversationsService.touchConversation(prepared.conversation.id);

    return {
      conversationId: prepared.conversation.id,
      answer,
      sources: prepared.sources,
      citations: prepared.sources,
    };
  }

  async streamToResponse(input: StreamChatInput, response: Response) {
    try {
      const prepared = await this.prepareChat(input);

      this.writeEvent(response, "session", {
        id: prepared.conversation.id,
        kbId: prepared.conversation.knowledgeBaseId,
        title: prepared.conversation.title ?? prepared.question.slice(0, 30),
        createdAt: prepared.conversation.createdAt.toISOString(),
        updatedAt: prepared.conversation.updatedAt.toISOString(),
      });
      this.writeEvent(response, "sources", prepared.sources);

      let answer = prepared.answer ?? "";

      if (prepared.answer) {
        for (const token of this.tokenizeAnswer(prepared.answer)) {
          this.writeEvent(response, "token", token);
        }
      } else {
        for await (const token of this.llmService.stream(prepared.messages)) {
          answer += token;
          this.writeEvent(response, "token", token);
        }
      }

      await this.conversationsService.createMessage({
        conversationId: prepared.conversation.id,
        role: MessageRole.assistant,
        content: answer,
        sources: prepared.sources,
      });
      await this.conversationsService.touchConversation(prepared.conversation.id);

      this.writeEvent(response, "done", {
        conversationId: prepared.conversation.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Chat stream failed";
      this.writeEvent(response, "error", message);
    } finally {
      response.end();
    }
  }

  private async prepareChat(input: StreamChatInput) {
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
      topK: input.topK,
    });

    const sources = await this.buildSources(retrieval);
    const shouldRefuse = sources.length === 0;
    const history = shouldRefuse
      ? []
      : await this.conversationsService.listRecentMessages(
          conversation.id,
          input.userId,
          12,
        );

    return {
      question,
      conversation,
      sources,
      answer: shouldRefuse ? this.buildNoEvidenceAnswer(question) : undefined,
      messages: shouldRefuse ? [] : this.buildMessages(history, sources),
    };
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

  private buildMessages(
    history: Array<{ role: MessageRole; content: string }>,
    sources: ChatSource[],
  ): LlmMessage[] {
    const sourceBlock =
      sources.length > 0
        ? sources
            .map(
              (source, index) =>
                `[${index + 1}] ${source.title}${source.page ? ` (page ${source.page})` : ""}\n${source.snippet.slice(0, 1200)}`,
            )
            .join("\n\n")
        : "No indexed sources were found for this question.";

    const messages: LlmMessage[] = [
      {
        role: "system",
        content: [
          "You are a grounded RAG assistant for the current knowledge base.",
          "Answer in Chinese unless the user clearly asks for another language.",
          "Use the retrieved sources as the primary basis for your answer.",
          "If the sources are insufficient, say so clearly and avoid making up facts.",
          "When possible, cite source numbers like [1], [2] inline.",
          "",
          "Retrieved sources:",
          sourceBlock,
        ].join("\n"),
      },
    ];

    for (const item of history) {
      if (!item.content.trim()) {
        continue;
      }

      if (item.role === MessageRole.user || item.role === MessageRole.assistant) {
        messages.push({
          role: item.role,
          content: item.content,
        });
      }
    }

    return messages;
  }

  private writeEvent(response: Response, event: string, payload: unknown) {
    response.write(`event: ${event}\n`);
    response.write(`data: ${JSON.stringify(payload)}\n\n`);
  }

  private buildNoEvidenceAnswer(question: string): string {
    return [
      "我暂时无法根据当前知识库中的内容可靠回答这个问题。",
      "没有检索到足够相关的资料片段，所以我不想直接猜测。",
      `你可以尝试换一种问法，或先补充与“${question}”相关的文档后再提问。`,
    ].join("\n");
  }

  private *tokenizeAnswer(answer: string): Generator<string> {
    for (const char of answer) {
      yield char;
    }
  }
}
