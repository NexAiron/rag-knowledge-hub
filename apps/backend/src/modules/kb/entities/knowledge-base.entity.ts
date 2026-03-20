import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("knowledge_bases")
export class KnowledgeBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "owner_id", type: "varchar", length: 36 })
  ownerId!: string;

  @Column({ name: "is_enabled", type: "bool", default: true })
  isEnabled!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

