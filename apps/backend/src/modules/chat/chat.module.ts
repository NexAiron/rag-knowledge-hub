import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RetrievalModule } from "../retrieval/retrieval.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatMessageEntity } from "./entities/chat-message.entity";
import { ChatSessionEntity } from "./entities/chat-session.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, ChatMessageEntity]),
    RetrievalModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}

