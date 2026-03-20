import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { KbService } from "./kb.service";
import { CreateKbDto } from "./dto/create-kb.dto";
import { UpdateKbDto } from "./dto/update-kb.dto";

@Controller("kb")
export class KbController {
  constructor(private readonly kbService: KbService) {}

  @Post()
  async create(@Body() payload: CreateKbDto) {
    return this.kbService.create(payload);
  }

  @Get()
  async findAll() {
    return this.kbService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.kbService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() payload: UpdateKbDto) {
    return this.kbService.update(id, payload);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.kbService.remove(id);
  }
}

