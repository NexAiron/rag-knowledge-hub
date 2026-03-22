import { Controller, Delete, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RequestUser } from "../../common/types/request-user.type";
import { ConversationsService } from "./conversations.service";

@UseGuards(JwtAuthGuard)
@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser, @Query("kbId") kbId: string) {
    return this.conversationsService.list(user.id, kbId);
  }

  @Get(":id/messages")
  getMessages(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.conversationsService.getMessages(id, user.id);
  }

  @Delete(":id")
  remove(@CurrentUser() user: RequestUser, @Param("id") id: string) {
    return this.conversationsService.delete(id, user.id);
  }
}
