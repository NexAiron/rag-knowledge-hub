import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./mvp/modules/auth/auth.module";
import { ChatModule } from "./mvp/modules/chat/chat.module";
import { ConversationsModule } from "./mvp/modules/conversations/conversations.module";
import { DocumentsModule } from "./mvp/modules/documents/documents.module";
import { EmbeddingsModule } from "./mvp/modules/embeddings/embeddings.module";
import { HealthModule } from "./mvp/modules/health/health.module";
import { IngestionModule } from "./mvp/modules/ingestion/ingestion.module";
import { KbModule } from "./mvp/modules/kb/kb.module";
import { LlmModule } from "./mvp/modules/llm/llm.module";
import { RetrievalModule } from "./mvp/modules/retrieval/retrieval.module";
import { UsersModule } from "./mvp/modules/users/users.module";
import { PrismaModule } from "./mvp/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ChatModule,
    UsersModule,
    KbModule,
    DocumentsModule,
    IngestionModule,
    EmbeddingsModule,
    RetrievalModule,
    ConversationsModule,
    LlmModule,
  ],
})
export class AppModule {}
