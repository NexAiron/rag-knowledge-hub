import { Module } from "@nestjs/common";
import { ConversationsModule } from "../conversations/conversations.module";
import { LlmModule } from "../llm/llm.module";
import { RetrievalModule } from "../retrieval/retrieval.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  imports: [ConversationsModule, RetrievalModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
