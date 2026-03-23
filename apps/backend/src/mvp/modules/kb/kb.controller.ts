import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RequestUser } from "../../common/types/request-user.type";
import { CreateKbDto } from "./dto/create-kb.dto";
import { KbIdParamDto } from "./dto/kb-id-param.dto";
import { KbService } from "./kb.service";

@UseGuards(JwtAuthGuard)
@Controller("kb")
export class KbController {
  constructor(private readonly kbService: KbService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateKbDto) {
    return this.kbService.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.kbService.list(user.id);
  }

  @Get(":id")
  detail(@CurrentUser() user: RequestUser, @Param() params: KbIdParamDto) {
    return this.kbService.detail(params.id, user.id);
  }

  @Delete(":id")
  remove(@CurrentUser() user: RequestUser, @Param() params: KbIdParamDto) {
    return this.kbService.remove(params.id, user.id);
  }
}
