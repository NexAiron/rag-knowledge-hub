import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RequestUser } from "../../common/types/request-user.type";
import { ChatDto } from "./dto/chat.dto";
import { StreamChatDto } from "./dto/stream-chat.dto";
import { ChatAskResponse, ChatService } from "./chat.service";

@UseGuards(JwtAuthGuard)
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("ask")
  ask(
    @CurrentUser() user: RequestUser,
    @Body() dto: ChatDto,
  ): Promise<ChatAskResponse> {
    return this.chatService.ask({
      userId: user.id,
      knowledgeBaseId: dto.knowledgeBaseId,
      conversationId: dto.conversationId,
      question: dto.question,
      topK: dto.topK,
    });
  }

  @Post("stream")
  async stream(
    @CurrentUser() user: RequestUser,
    @Body() dto: StreamChatDto,
    @Res() response: Response,
  ) {
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");

    await this.chatService.streamToResponse(
      {
        userId: user.id,
        knowledgeBaseId: dto.knowledgeBaseId,
        conversationId: dto.conversationId,
        question: dto.question,
        topK: dto.topK,
      },
      response,
    );
  }
}
