import { Body, Controller, Post } from "@nestjs/common";
import { RetrievalService } from "./retrieval.service";
import { RetrieveDto } from "./dto/retrieve.dto";

@Controller("retrieval")
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post("search")
  async search(@Body() payload: RetrieveDto) {
    return this.retrievalService.retrieve(payload);
  }
}

