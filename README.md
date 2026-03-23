# NexAiron RAG Knowledge Hub

面向 ToC 的 RAG 知识库问答系统。

当前项目基于 `Next.js + NestJS + Prisma + MySQL`，已经具备最小可用闭环：

1. 用户注册 / 登录
2. 创建知识库
3. 上传 PDF / Markdown 文档
4. 解析文档、切分 chunk、生成 embedding
5. 在知识库范围内执行检索式问答
6. 保存聊天会话和回答来源

## 技术栈

- 前端：Next.js 15、TypeScript、Ant Design、Zustand
- 后端：NestJS、Prisma
- 数据库：MySQL
- 文件处理：Multer、本地 `uploads`
- RAG：文档解析、chunking、embedding、retrieval、LLM provider

## 当前能力

- 认证：注册、登录、JWT、当前用户信息
- 知识库：创建、列表、详情、删除
- 文档：上传、列表、删除、状态轮询
- 解析：支持 PDF / Markdown
- 问答：支持会话列表、消息记录、SSE 流式输出、来源引用
- Provider：支持 mock / Qwen 两套模型与向量实现

## 目录说明

- `apps/frontend`
  负责页面、Next Route Handler 代理、状态管理和交互层
- `apps/backend`
  负责认证、知识库、文档处理、RAG 链路和会话管理
- `docs`
  项目结构与架构说明
- `docker`
  本地依赖服务示例

注意：

- 后端当前实际运行的是 `apps/backend/src/mvp/*`
- `apps/backend/src/modules/*` 属于历史残留目录，本轮未直接删除

## 启动方式

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

前端：

- `apps/frontend/.env.local`

后端：

- `apps/backend/.env`

可以参考：

- [apps/frontend/.env.example](./apps/frontend/.env.example)
- [apps/backend/.env.example](./apps/backend/.env.example)

### 3. 初始化数据库

```bash
pnpm --filter @nexairon/backend db:sync
```

### 4. 启动项目

开发模式：

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
- `PATCH /api/auth/me`

### Knowledge Base

- `POST /api/kb`
- `GET /api/kb`
- `GET /api/kb/:id`
- `DELETE /api/kb/:id`

### Documents

- `POST /api/documents/upload`
- `GET /api/documents?kbId=xxx`
- `DELETE /api/documents/:id`

### Chat / Conversations

- `GET /api/conversations?kbId=xxx`
- `GET /api/conversations/:id/messages`
- `DELETE /api/conversations/:id`
- `POST /api/chat/stream`
- `POST /api/chat/ask`

## 当前已知限制

- retrieval 仍是应用层内存计算，适合当前中期项目与中小规模数据
- ingestion 仍是进程内异步触发，不是可靠任务队列
- 旧目录与部分本地运行日志还未完成最终清理

## 文档

- [docs/STRUCTURE.md](./docs/STRUCTURE.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
