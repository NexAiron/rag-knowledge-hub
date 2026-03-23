import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateKbDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
