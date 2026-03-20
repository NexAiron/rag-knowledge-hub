import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class RetrieveDto {
  @IsString()
  @MaxLength(36)
  kbId!: string;

  @IsString()
  query!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  topK?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  scoreThreshold?: number;
}
