import "reflect-metadata";
import { DataSource } from "typeorm";

export const mysqlDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST ?? "127.0.0.1",
  port: Number(process.env.MYSQL_PORT ?? 3306),
  username: process.env.MYSQL_USERNAME ?? "root",
  password: process.env.MYSQL_PASSWORD ?? "",
  database: process.env.MYSQL_DATABASE ?? "rag_kb",
  entities: ["src/modules/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});

