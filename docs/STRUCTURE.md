# Project Structure

本文档说明当前项目目录组织和各层职责，内容以当前真实实现为准。

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
├─ .env.local
├─ next.config.ts
└─ tailwind.config.ts
```

### `src/app`

- Next.js App Router 页面
- 前端代理 API Route
- 全局样式和布局

重点页面：

- `/login`
- `/register`
- `/dashboard`
- `/kb/[id]`
- `/kb/[id]/documents`
- `/kb/[id]/chat`

### `src/components`

- 布局组件
- 登录注册相关 UI
- 知识库卡片
- 文档表格与状态标签
- 聊天区、来源面板、会话列表
- 品牌图形与语言切换器

### `src/lib`

- 前端 API 封装
- i18n 文案
- 服务端代理工具
- 数据映射逻辑

### `src/stores`

- `user-store`
  - 登录、注册、登出、用户态恢复
- `kb-store`
  - 知识库列表、创建、同步
- `chat-store`
  - 会话与消息状态管理
- `locale-store`
  - 中英文切换状态

### `src/types`

- 用户、知识库、文档、消息、来源等前端共享类型

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
├─ uploads
├─ .env
└─ tsconfig.json
```

### `prisma/schema.prisma`

当前核心实体：

- `User`
- `KnowledgeBase`
- `Document`
- `Chunk`
- `Conversation`
- `Message`

### `src/mvp/common`

- 全局异常处理
- 全局响应封装
- JWT Guard
- 当前用户装饰器

### `src/mvp/prisma`

- PrismaModule
- PrismaService

### `src/mvp/modules`

当前主模块：

- `auth`
  - 注册、登录、JWT
- `users`
  - 用户读写
- `kb`
  - 知识库管理
- `documents`
  - 上传、列表、删除
- `parser`
  - Markdown / PDF 解析
- `chunking`
  - 文本切块
- `ingestion`
  - 文档处理主流程
- `embeddings`
  - embedding 生成与写入
- `retrieval`
  - 检索逻辑

## 文档与设计文件

```txt
docs
├─ ARCHITECTURE.md
└─ STRUCTURE.md
```

职责：

- `ARCHITECTURE.md`
  - 说明系统结构、处理链路、同步策略
- `STRUCTURE.md`
  - 说明目录职责和代码边界

## 当前约定

- 前端统一通过 `/api/*` 代理访问后端
- 用户 token 通过 cookie 传递
- 文档处理状态以数据库为准
- 后端启动前自动执行 Prisma 同步
- UI 统一采用淡蓝主题、双语切换和图标系统

## 建议的开发边界

- 页面布局与交互：放前端 `app / components`
- 状态管理：放前端 `stores`
- 纯接口逻辑：放前端 `lib/api`
- 业务服务逻辑：放后端 `src/mvp/modules`
- 数据访问：统一走 Prisma
