import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KbController } from "./kb.controller";
import { KbService } from "./kb.service";
import { KnowledgeBaseEntity } from "./entities/knowledge-base.entity";

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBaseEntity])],
  controllers: [KbController],
  providers: [KbService],
  exports: [KbService],
})
export class KbModule {}

