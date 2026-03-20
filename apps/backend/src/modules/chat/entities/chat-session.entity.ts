import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat_sessions")
export class ChatSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "kb_id", type: "varchar", length: 36 })
  kbId!: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

