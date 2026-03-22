# NexAiron RAG Knowledge Hub

基于 RAG 的学习资料问答系统 MVP，采用前后端分离架构：

- 前端：Next.js 15 + TypeScript + Tailwind CSS + Zustand
- 后端：NestJS + Prisma ORM
- 数据库：MySQL
- 文件上传：Multer + 本地 `uploads`

当前版本已经具备从用户认证、知识库管理、文档上传、文档解析到 chunk 入库的主链路能力，并完成了双语界面、淡蓝主题视觉和图标系统整理。

## 当前已完成

- 用户注册、登录、JWT 鉴权
- `auth/me` 用户态恢复
- 知识库创建、列表、详情、删除
- PDF / Markdown 文档上传
- 文档状态流转：`uploaded / processing / completed / failed`
- Markdown 解析、PDF 文本提取、基础清洗
- Chunk 切分与 metadata 保留
- Embedding 写入 MySQL JSON 字段
- 前后端真实代理联调
- 中英文切换
- 淡蓝主题、现代化工作台界面、统一图标系统

## 当前主链路

1. 用户注册或登录
2. 创建知识库
3. 上传 PDF / Markdown 文档
4. 后端保存文档元信息，状态写入 `uploaded`
5. ingestion 流程将状态更新为 `processing`
6. parser 解析文档并输出统一结构
7. chunking 切分文本并保留 `page / section / order`
8. 写入 chunks 与 embeddings
9. 文档状态更新为 `completed`

## 关键技术说明

### 数据库同步

后端启动前会自动执行：

- `prisma db push`
- `prisma generate`

这样可以避免 schema 已修改但数据库表未同步的情况。

### 前端数据同步

- 登录后通过 cookie 保存 `access_token`
- 前端启动时通过 `/api/me` 恢复用户状态
- 文档上传、删除、处理轮询时会同步刷新知识库统计

### UI 设计方向

- 主色调：淡蓝色
- 风格：现代、克制、非平铺式信息布局
- 特点：双语切换、统一字体基线、统一图标语言

## 目录

- [docs/STRUCTURE.md](./docs/STRUCTURE.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## 快速启动

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

### 3. 启动 MySQL

请确保 `DATABASE_URL` 指向可访问的 MySQL 实例。

### 4. 启动项目

分别启动：

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

## 当前仍待完善

- Chat 后端主链路继续增强
- 更完整的 sources 展示与引用结构
- 未登录保护和页面守卫进一步完善
- 更稳定的数据库运行环境
- 测试、部署、日志与监控
