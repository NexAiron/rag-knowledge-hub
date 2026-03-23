import { IsNotEmpty, IsString } from "class-validator";

export class KbIdParamDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
