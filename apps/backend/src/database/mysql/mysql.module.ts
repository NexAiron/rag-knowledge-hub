import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "node:path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("MYSQL_HOST", "127.0.0.1"),
        port: configService.get<number>("MYSQL_PORT", 3306),
        username: configService.get<string>("MYSQL_USERNAME", "root"),
        password: configService.get<string>("MYSQL_PASSWORD", ""),
        database: configService.get<string>("MYSQL_DATABASE", "rag_kb"),
        autoLoadEntities: true,
        entities: [join(__dirname, "../../modules/**/*.entity{.ts,.js}")],
        synchronize: false,
      }),
    }),
  ],
})
export class MysqlModule {}

