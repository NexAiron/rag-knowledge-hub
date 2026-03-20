import { IsString, MaxLength } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @MaxLength(36)
  kbId!: string;

  @IsString()
  @MaxLength(255)
  fileName!: string;
}

