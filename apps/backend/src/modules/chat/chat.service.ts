import { Injectable, MessageEvent, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { RetrievalService } from "../retrieval/retrieval.service";
import { AskDto } from "./dto/ask.dto";
import { CreateSessionDto } from "./dto/create-session.dto";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { ChatSessionEntity } from "./entities/chat-session.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly sessionRepo: Repository<ChatSessionEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepo: Repository<ChatMessageEntity>,
    private readonly retrievalService: RetrievalService,
  ) {}

  async createSession(payload: CreateSessionDto) {
    const session = this.sessionRepo.create({
      kbId: payload.kbId,
      userId: "demo-user",
    });
    return this.sessionRepo.save(session);
  }

  async ask(payload: AskDto) {
    await this.getSession(payload.sessionId);

    await this.messageRepo.save(
      this.messageRepo.create({
        sessionId: payload.sessionId,
        role: "user",
        content: payload.question,
      }),
    );

    return {
      sessionId: payload.sessionId,
      status: "accepted",
      streamEndpoint: `/api/chat/sessions/${payload.sessionId}/stream?question=${encodeURIComponent(payload.question)}`,
    };
  }

  async listMessages(sessionId: string) {
    await this.getSession(sessionId);
    return this.messageRepo.find({
      where: { sessionId },
      order: { createdAt: "ASC" },
    });
  }

  streamAnswer(
    sessionId: string,
    question: string,
    options?: { topK?: number; scoreThreshold?: number },
  ): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const run = async () => {
        const session = await this.getSession(sessionId);

        const retrieval = await this.retrievalService.retrieve({
          kbId: session.kbId,
          query: question,
          topK: options?.topK ?? 5,
          scoreThreshold: options?.scoreThreshold ?? 0,
        });

        subscriber.next({
          type: "sources",
          data: JSON.stringify(retrieval.chunks),
        });

        const tokens = [
          "这是",
          "一个",
          "RAG",
          "系统的",
          "SSE",
          "流式",
          "响应示例。",
        ];

        for (const token of tokens) {
          subscriber.next({ type: "token", data: token });
          await new Promise((resolve) => setTimeout(resolve, 160));
        }

        await this.messageRepo.save(
          this.messageRepo.create({
            sessionId,
            role: "assistant",
            content: tokens.join(""),
          }),
        );

        subscriber.next({ type: "done", data: "completed" });
        subscriber.complete();
      };

      void run().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "stream failed";
        subscriber.error(message);
      });
    });
  }

  private async getSession(sessionId: string) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException("Chat session not found");
    }

    return session;
  }
}
