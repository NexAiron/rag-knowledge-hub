# NexAiron RAG Knowledge Hub

一个面向学习资料问答场景的 RAG 项目脚手架，采用前后端分离架构：

- 前端：Next.js 15 + TypeScript + Tailwind CSS
- 后端：NestJS + Prisma ORM
- 数据库：MySQL
- 文件上传：Multer + 本地 `uploads` 目录

当前版本聚焦 MVP，已经覆盖认证、知识库管理、文档上传、文档解析、Chunk 入库和基础检索链路。

## 项目目标

- 支持用户注册、登录和 JWT 鉴权
- 支持创建和管理知识库
- 支持上传 PDF / Markdown 文档
- 支持文档解析、文本清洗和 Chunk 切分
- 为后续问答、引用来源展示和向量检索预留结构

## 技术栈

### Frontend

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Zustand

### Backend

- NestJS 10
- Prisma ORM
- MySQL
- Passport JWT
- Multer
- `pdf-parse`

## 当前实现范围

### 已完成

- `auth`
  - 用户注册
  - 用户登录
  - JWT 鉴权
  - `GET /api/auth/me`
- `kb`
  - 创建知识库
  - 查询当前用户知识库列表
  - 查询知识库详情
  - 删除知识库
- `documents`
  - 上传 PDF / Markdown
  - 保存文档元信息
  - 文档状态管理：`uploaded / processing / completed / failed`
  - 查询知识库下文档列表
  - 删除文档
- `parser`
  - Markdown 解析
  - PDF 文本提取
  - 统一输出结构
  - 文本清洗
- `ingestion`
  - 文档解析
  - Chunk 切分
  - Embedding 存储

### 进行中 / 待完善

- Chat API 与前端对接
- 更完整的引用来源结构
- 队列化异步处理
- 测试与部署文档

## 目录结构

```txt
.
├─ apps
│  ├─ backend
│  └─ frontend
├─ docker
├─ docs
├─ packages
└─ scripts
```

详细说明见：

- `docs/STRUCTURE.md`
- `docs/ARCHITECTURE.md`

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

- `apps/frontend/.env.example` -> `apps/frontend/.env.local`
- `apps/backend/.env.example` -> `apps/backend/.env`

建议至少确认以下变量：

- 前端：`NEXT_PUBLIC_API_BASE_URL`
- 后端：`DATABASE_URL`
- 后端：`JWT_SECRET`

### 3. 启动 MySQL

项目当前依赖 MySQL。请确保 `apps/backend/.env` 中的 `DATABASE_URL` 和本地 MySQL 实际连接信息一致。

如果使用 Docker，请先检查 `docker/docker-compose.yml` 中的数据库账号密码，再和 `DATABASE_URL` 保持一致。

### 4. 生成 Prisma Client

```bash
pnpm --filter @nexairon/backend prisma:generate
```

### 5. 启动开发环境

```bash
pnpm dev
```

或分别启动：

```bash
pnpm --filter @nexairon/backend start:dev
pnpm --filter @nexairon/frontend dev
```

## 关键接口

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Knowledge Base

- `POST /api/kb`
- `GET /api/kb`
- `GET /api/kb/:id`
- `DELETE /api/kb/:id`

### Documents

- `POST /api/documents/upload`
- `GET /api/documents?kbId=xxx`
- `DELETE /api/documents/:id`

## 文档状态说明

- `uploaded`：文件已上传，等待处理
- `processing`：正在解析、切块、生成 embedding
- `completed`：处理完成，可参与检索
- `failed`：处理失败，可根据 `errorMessage` 排查

## 开发说明

- 后端当前以 `src/mvp` 目录下的模块为主
- Prisma schema 位于 `apps/backend/prisma/schema.prisma`
- 前端 `/api/*` 路由当前作为代理层，转发到 NestJS 后端

## 后续建议

- 增加数据库迁移说明
- 增加联调说明与示例账号
- 增加测试、日志和部署文档
