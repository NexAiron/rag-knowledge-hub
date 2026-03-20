# Architecture

## Data Split

- MySQL: users, kb, documents, chat, jobs, logs
- PostgreSQL + pgvector: chunk embeddings + vector search
- Redis: cache, rate-limit, queue/state placeholder

## Core Flow

1. Upload document
2. Parse + clean
3. Chunk
4. Embedding
5. Upsert to vector store
6. Query embedding
7. Retrieve + optional rerank
8. LLM generation via SSE streaming

