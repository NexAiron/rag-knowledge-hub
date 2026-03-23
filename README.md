# NexAiron RAG Knowledge Hub

基于 RAG 的学习资料问答系统 MVP。

## 技术栈

- 前端：Next.js 15 + TypeScript + Ant Design + Zustand
- 后端：NestJS + Prisma ORM
- 数据库：MySQL
- 文件上传：Multer + 本地 `uploads`

## 当前已完成

- 用户注册、登录、JWT 鉴权、`auth/me`
- 知识库创建、列表、详情、删除
- PDF / Markdown 文档上传与删除
- 文档状态流转：`uploaded / processing / completed / failed`
- Markdown 解析、PDF 文本提取、基础清洗
- Chunk 切分与 metadata 保留
- 前后端真实联调
- 前端中英文切换
- 前端浅色 / 暗黑模式切换
- 前端主页面统一接入 Ant Design

## 主链路

1. 用户注册或登录
2. 创建知识库
3. 上传 PDF / Markdown 文档
4. 后端保存文档元信息并写入 `uploaded`
5. ingestion 流程更新状态为 `processing`
6. parser 输出统一结构
7. chunking 切分文本并保留 `page / section / order`
8. chunks 与 embeddings 入库
9. 文档状态更新为 `completed`

## 启动方式

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

- `apps/frontend/.env.local`
- `apps/backend/.env`

至少确认：

- 前端：`NEXT_PUBLIC_API_BASE_URL`
- 后端：`DATABASE_URL`
- 后端：`JWT_SECRET`

### 3. 启动数据库

请确保 `DATABASE_URL` 指向可访问的 MySQL 实例。

### 4. 启动项目

```bash
pnpm --filter @nexairon/backend start
pnpm --filter @nexairon/frontend start
```

开发模式：

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

## 文档

- [docs/STRUCTURE.md](./docs/STRUCTURE.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 当前仍待完善

- 问答生成链路继续增强
- sources 展示进一步细化
- 更多测试与部署配置
- 数据库与任务处理的生产化能力
