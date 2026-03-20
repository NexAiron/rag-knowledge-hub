import {
  Body,
  Controller,
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

  @Sse("sessions/:sessionId/stream")
  stream(
    @Param("sessionId") sessionId: string,
    @Query("question") question = "请总结知识库核心内容",
  ): Observable<MessageEvent> {
    return this.chatService.streamAnswer(sessionId, question);
  }
}

