import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class ChatDto {
  @IsString()
  knowledgeBaseId!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsString()
  question!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  topK?: number;
}
