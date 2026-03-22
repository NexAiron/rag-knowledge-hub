import { Module } from "@nestjs/common";
import { KbModule } from "../kb/kb.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { ConversationsController } from "./conversations.controller";
import { ConversationsService } from "./conversations.service";

@Module({
  imports: [PrismaModule, KbModule],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
