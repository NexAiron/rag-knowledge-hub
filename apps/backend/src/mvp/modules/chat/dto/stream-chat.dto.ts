import { IsOptional, IsString } from "class-validator";

export class StreamChatDto {
  @IsString()
  knowledgeBaseId!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsString()
  question!: string;
}
