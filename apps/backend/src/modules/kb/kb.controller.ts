import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { KbService } from "./kb.service";
import { CreateKbDto } from "./dto/create-kb.dto";
import { ListKbDto } from "./dto/list-kb.dto";
import { UpdateKbDto } from "./dto/update-kb.dto";
import { UpdateKbStatusDto } from "./dto/update-kb-status.dto";

@Controller("kb")
export class KbController {
  constructor(private readonly kbService: KbService) {}

  @Post()
  async create(@Body() payload: CreateKbDto) {
    return this.kbService.create(payload);
  }

  @Get()
  async findAll(@Query() query: ListKbDto) {
    return this.kbService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.kbService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() payload: UpdateKbDto) {
    return this.kbService.update(id, payload);
  }

  @Patch(":id/status")
  async setStatus(@Param("id") id: string, @Body() payload: UpdateKbStatusDto) {
    return this.kbService.setEnabled(id, payload.isEnabled);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.kbService.remove(id);
  }
}
