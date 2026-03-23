import { IsNotEmpty, IsString } from "class-validator";

export class ListDocumentsDto {
  @IsString()
  @IsNotEmpty()
  kbId!: string;
}
