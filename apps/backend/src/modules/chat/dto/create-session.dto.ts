import { IsString, MaxLength } from "class-validator";

export class CreateSessionDto {
  @IsString()
  @MaxLength(36)
  kbId!: string;
}

