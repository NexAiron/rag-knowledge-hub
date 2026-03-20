# NexAiron RAG Knowledge Hub

`NexAiron` 的前后端分离 RAG 知识库问答系统脚手架。

## 技术栈

- 前端: Next.js + Tailwind CSS + TypeScript
- 后端: NestJS + TypeScript
- 业务数据库: MySQL + TypeORM
- 向量数据库: PostgreSQL + pgvector
- 缓存/队列: Redis (已预留模块接口)
- 流式返回: SSE

## 架构说明

> `pgvector` 是 PostgreSQL 扩展，不能运行在 MySQL 上。  
> 本项目采用 MySQL 存业务数据，PostgreSQL(pgvector) 存向量数据。

## 项目结构

```txt
.
├── apps
│   ├── backend
│   └── frontend
├── docker
│   └── docker-compose.yml
├── docs
│   ├── ARCHITECTURE.md
│   └── STRUCTURE.md
├── packages
│   └── shared-types
└── scripts
```

## 快速启动

1. 安装依赖

```bash
pnpm install
```

2. 启动基础设施

```bash
docker compose -f docker/docker-compose.yml up -d
```

3. 配置环境变量

- `apps/frontend/.env.example` -> `apps/frontend/.env.local`
- `apps/backend/.env.example` -> `apps/backend/.env`

4. 启动开发服务

```bash
pnpm dev
```

## 模块划分 (后端)

- `auth`: 登录/鉴权
- `users`: 用户信息
- `kb`: 知识库管理
- `documents`: 文档上传与元数据
- `ingestion`: 入库流水线编排
- `embeddings`: 向量化接口
- `retrieval`: 召回/重排
- `chat`: 问答会话与 SSE
- `llm`: 模型调用封装
- `redis`: 缓存接口
- `queue`: 队列接口
- `storage`: 文件存储抽象
- `health`: 健康检查

## 文档

- 结构与职责: `docs/STRUCTURE.md`
- 架构与链路: `docs/ARCHITECTURE.md`
