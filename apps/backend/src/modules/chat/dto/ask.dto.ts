import { IsString, MaxLength } from "class-validator";

export class AskDto {
  @IsString()
  @MaxLength(36)
  sessionId!: string;

  @IsString()
  question!: string;
}

