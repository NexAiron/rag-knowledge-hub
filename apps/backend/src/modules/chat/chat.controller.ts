import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Query,
  Sse,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AskDto } from "./dto/ask.dto";
import { CreateSessionDto } from "./dto/create-session.dto";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("sessions")
  async createSession(@Body() payload: CreateSessionDto) {
    return this.chatService.createSession(payload);
  }

  @Post("ask")
  async ask(@Body() payload: AskDto) {
    return this.chatService.ask(payload);
  }

  @Get("sessions/:sessionId/messages")
  async listMessages(@Param("sessionId") sessionId: string) {
    return this.chatService.listMessages(sessionId);
  }

  @Sse("sessions/:sessionId/stream")
  stream(
    @Param("sessionId") sessionId: string,
    @Query("question") question = "请总结知识库核心内容",
    @Query("topK") topK?: string,
    @Query("scoreThreshold") scoreThreshold?: string,
  ): Observable<MessageEvent> {
    const parsedTopK = topK ? Number(topK) : undefined;
    const parsedThreshold = scoreThreshold ? Number(scoreThreshold) : undefined;

    return this.chatService.streamAnswer(sessionId, question, {
      topK: Number.isFinite(parsedTopK) ? parsedTopK : undefined,
      scoreThreshold: Number.isFinite(parsedThreshold) ? parsedThreshold : undefined,
    });
  }
}
