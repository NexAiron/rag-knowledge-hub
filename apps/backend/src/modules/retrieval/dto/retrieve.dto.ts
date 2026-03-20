import { IsOptional, IsString, MaxLength } from "class-validator";

export class RetrieveDto {
  @IsString()
  @MaxLength(36)
  kbId!: string;

  @IsString()
  query!: string;

  @IsOptional()
  topK?: number;
}

