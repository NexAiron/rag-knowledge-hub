import { IsNotEmpty, IsString } from "class-validator";

export class DocumentIdParamDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
