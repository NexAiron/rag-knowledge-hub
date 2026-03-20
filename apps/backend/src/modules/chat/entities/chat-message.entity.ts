import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chat_messages")
export class ChatMessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "session_id", type: "varchar", length: 36 })
  sessionId!: string;

  @Column({ type: "varchar", length: 20 })
  role!: "user" | "assistant" | "system";

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

