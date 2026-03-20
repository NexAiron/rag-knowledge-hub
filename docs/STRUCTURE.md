# Project Structure

## Frontend

```txt
apps/frontend
├── public
├── src
│   ├── app
│   │   ├── (auth)
│   │   ├── (dashboard)
│   │   └── api
│   ├── components
│   ├── features
│   ├── lib
│   ├── store
│   ├── styles
│   └── types
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Backend

```txt
apps/backend
├── src
│   ├── common
│   ├── database
│   │   ├── mysql
│   │   ├── vector
│   │   └── migrations
│   ├── modules
│   │   ├── auth
│   │   ├── users
│   │   ├── kb
│   │   ├── documents
│   │   ├── ingestion
│   │   ├── embeddings
│   │   ├── retrieval
│   │   ├── chat
│   │   ├── llm
│   │   ├── prompts
│   │   ├── redis
│   │   ├── queue
│   │   ├── storage
│   │   └── health
│   └── shared
├── test
└── .env.example
```

## Directory Purpose

- `app` / `modules`: 按业务拆分，避免单体 service
- `database/mysql`: 业务表连接配置与迁移
- `database/vector`: pgvector 连接与向量实体
- `documents` + `ingestion` + `retrieval`: RAG 主链路
- `chat`: 会话、消息、SSE 流式输出
- `redis` + `queue`: 缓存与队列能力预留

## Key Files

- `apps/frontend/src/lib/sse/chat-stream.ts`: SSE 客户端封装
- `apps/frontend/src/app/(dashboard)/chat/[sessionId]/page.tsx`: 流式消息渲染示例
- `apps/backend/src/modules/chat/chat.controller.ts`: SSE 端点
- `apps/backend/src/modules/retrieval/retrieval.service.ts`: 召回服务骨架
- `apps/backend/src/database/vector/entities/document-chunk.vector.entity.ts`: 向量实体

## Env Variables

详见:

- `apps/frontend/.env.example`
- `apps/backend/.env.example`

