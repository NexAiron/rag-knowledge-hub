import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class RetrieveDto {
  @IsString()
  knowledgeBaseId!: string;

  @IsString()
  query!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  topK?: number;
}
