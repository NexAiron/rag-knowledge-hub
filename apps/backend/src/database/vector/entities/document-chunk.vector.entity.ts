import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("document_chunks")
@Index("idx_document_chunks_kb", ["kbId"])
export class DocumentChunkVectorEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "kb_id", type: "varchar", length: 36 })
  kbId!: string;

  @Column({ name: "document_id", type: "varchar", length: 36 })
  documentId!: string;

  @Column({ name: "chunk_index", type: "int" })
  chunkIndex!: number;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "vector" as any, length: 1536 })
  embedding!: number[];
}
