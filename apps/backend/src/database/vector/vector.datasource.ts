import "reflect-metadata";
import { DataSource } from "typeorm";
import { DocumentChunkVectorEntity } from "./entities/document-chunk.vector.entity";

export const vectorDataSource = new DataSource({
  type: "postgres",
  host: process.env.VECTOR_DB_HOST ?? "127.0.0.1",
  port: Number(process.env.VECTOR_DB_PORT ?? 5432),
  username: process.env.VECTOR_DB_USERNAME ?? "postgres",
  password: process.env.VECTOR_DB_PASSWORD ?? "",
  database: process.env.VECTOR_DB_DATABASE ?? "rag_vector",
  entities: [DocumentChunkVectorEntity],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});

