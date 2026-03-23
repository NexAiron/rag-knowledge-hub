import { BadRequestException } from "@nestjs/common";

export class DocumentParserException extends BadRequestException {
  constructor(message = "Failed to parse document") {
    super(message);
  }
}
