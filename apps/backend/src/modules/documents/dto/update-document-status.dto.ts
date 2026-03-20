import { IsIn } from "class-validator";

export class UpdateDocumentStatusDto {
  @IsIn(["pending", "processing", "indexed", "failed"])
  status!: "pending" | "processing" | "indexed" | "failed";
}

