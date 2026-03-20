import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("documents")
export class DocumentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "kb_id", type: "varchar", length: 36 })
  kbId!: string;

  @Column({ name: "file_name", type: "varchar", length: 255 })
  fileName!: string;

  @Column({ name: "file_url", type: "varchar", length: 512, nullable: true })
  fileUrl?: string;

  @Column({ type: "varchar", length: 30, default: "pending" })
  status!: "pending" | "processing" | "indexed" | "failed";

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

