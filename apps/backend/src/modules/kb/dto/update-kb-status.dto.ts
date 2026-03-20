import { IsBoolean } from "class-validator";

export class UpdateKbStatusDto {
  @IsBoolean()
  isEnabled!: boolean;
}

