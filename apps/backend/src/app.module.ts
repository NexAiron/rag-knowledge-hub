import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MysqlModule } from "./database/mysql/mysql.module";
import { VectorModule } from "./database/vector/vector.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { KbModule } from "./modules/kb/kb.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { IngestionModule } from "./modules/ingestion/ingestion.module";
import { EmbeddingsModule } from "./modules/embeddings/embeddings.module";
import { RetrievalModule } from "./modules/retrieval/retrieval.module";
import { ChatModule } from "./modules/chat/chat.module";
import { LlmModule } from "./modules/llm/llm.module";
import { PromptsModule } from "./modules/prompts/prompts.module";
import { RedisModule } from "./modules/redis/redis.module";
import { QueueModule } from "./modules/queue/queue.module";
import { StorageModule } from "./modules/storage/storage.module";
import { HealthModule } from "./modules/health/health.module";

const useVectorDb =
  (process.env.USE_VECTOR_DB ?? "false").toLowerCase() === "true";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MysqlModule,
    ...(useVectorDb ? [VectorModule] : []),
    AuthModule,
    UsersModule,
    KbModule,
    DocumentsModule,
    IngestionModule,
    EmbeddingsModule,
    RetrievalModule,
    ChatModule,
    LlmModule,
    PromptsModule,
    RedisModule,
    QueueModule,
    StorageModule,
    HealthModule,
  ],
})
export class AppModule {}
