# Project Structure

本文档说明当前项目的目录组织方式，以及各目录的职责边界。

## 根目录

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

## Frontend

```txt
apps/frontend
├─ src
│  ├─ app
│  ├─ components
│  ├─ lib
│  ├─ stores
│  └─ types
├─ public
├─ .env.example
├─ next.config.ts
└─ tsconfig.json
```

### 目录职责

- `src/app`
  - Next.js App Router 页面与前端 API Route
- `src/components`
  - 可复用 UI 组件
- `src/lib`
  - 前端请求封装、SSE、服务端代理工具
- `src/stores`
  - Zustand 状态管理
- `src/types`
  - 前端共享类型定义

### 当前约定

- 页面请求优先走 `src/app/api/*` 代理层
- 代理层统一转发到后端 `NestJS /api/*`
- 前端用 cookie 保存登录后的 `access_token`

## Backend

```txt
apps/backend
├─ prisma
│  └─ schema.prisma
├─ src
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ mvp
│  │  ├─ common
│  │  ├─ prisma
│  │  └─ modules
│  └─ types
├─ test
├─ .env.example
└─ tsconfig.json
```

### `src/mvp/common`

- 全局异常处理
- 全局响应拦截
- JWT Guard
- 当前用户装饰器

### `src/mvp/prisma`

- Prisma Client 封装
- NestJS 中的 PrismaModule / PrismaService

### `src/mvp/modules`

当前主要模块如下：

- `auth`
  - 注册、登录、JWT 鉴权
- `users`
  - 用户读写封装
- `kb`
  - 知识库管理
- `documents`
  - 文档上传、列表、删除
- `parser`
  - PDF / Markdown 解析
- `chunking`
  - 文本切块
- `ingestion`
  - 文档处理主流程
- `embeddings`
  - embedding 生成与入库
- `retrieval`
  - 基础检索逻辑
- `conversations`
  - 会话与消息管理
- `llm`
  - 模型调用抽象

## Prisma 数据模型

Prisma schema 位于：

- `apps/backend/prisma/schema.prisma`

当前核心实体：

- `User`
- `KnowledgeBase`
- `Document`
- `Chunk`
- `Conversation`
- `Message`

## 建议的开发边界

- 页面逻辑放前端 `app`
- 纯业务状态放前端 `stores`
- 后端接口逻辑放 `mvp/modules`
- 数据库访问统一走 Prisma
- 文档处理链路保持：
  - `documents` -> `parser` -> `chunking` -> `ingestion` -> `retrieval`

## 已废弃 / 不再作为主实现的内容

仓库中仍保留了一些旧目录和旧代码痕迹，但当前主线实现以 `src/mvp` 为准。

开发时建议优先参考：

- `apps/backend/src/mvp/**`
- `apps/frontend/src/**`
