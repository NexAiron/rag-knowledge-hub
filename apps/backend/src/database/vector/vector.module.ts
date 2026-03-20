import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentChunkVectorEntity } from "./entities/document-chunk.vector.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: "vector",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("VECTOR_DB_HOST", "127.0.0.1"),
        port: configService.get<number>("VECTOR_DB_PORT", 5432),
        username: configService.get<string>("VECTOR_DB_USERNAME", "postgres"),
        password: configService.get<string>("VECTOR_DB_PASSWORD", ""),
        database: configService.get<string>("VECTOR_DB_DATABASE", "rag_vector"),
        entities: [DocumentChunkVectorEntity],
        synchronize: false,
      }),
    }),
  ],
})
export class VectorModule {}

