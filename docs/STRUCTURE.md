# 目录结构

## 顶层

```text
nexairon-rag-knowledge-hub
├─ apps
│  ├─ backend
│  └─ frontend
├─ docs
├─ docker
├─ packages
├─ README.md
└─ pnpm-workspace.yaml
```

## apps/backend

```text
apps/backend
├─ prisma
│  └─ schema.prisma
├─ src
│  ├─ app.module.ts
│  ├─ main.ts
│  └─ mvp
│     ├─ common
│     ├─ modules
│     │  ├─ auth
│     │  ├─ chat
│     │  ├─ conversations
│     │  ├─ documents
│     │  ├─ embeddings
│     │  ├─ health
│     │  ├─ ingestion
│     │  ├─ kb
│     │  ├─ llm
│     │  ├─ parser
│     │  ├─ chunking
│     │  ├─ retrieval
│     │  └─ users
│     └─ prisma
└─ uploads
```

说明：

- 当前实际运行的是 `src/mvp/*`
- `src/modules/*` 是历史残留，本轮只标记，不直接依赖

## apps/frontend

```text
apps/frontend
├─ src
│  ├─ app
│  │  ├─ api
│  │  ├─ dashboard
│  │  ├─ kb
│  │  ├─ login
│  │  ├─ profile
│  │  └─ register
│  ├─ components
│  │  ├─ auth
│  │  ├─ chat
│  │  ├─ documents
│  │  ├─ feedback
│  │  ├─ kb
│  │  ├─ layout
│  │  ├─ providers
│  │  └─ theme
│  ├─ hooks
│  ├─ lib
│  │  ├─ api
│  │  ├─ auth
│  │  ├─ i18n
│  │  ├─ server
│  │  └─ sse
│  ├─ stores
│  └─ types
├─ package.json
└─ next.config.ts
```

## 关键目录职责

- `app`
  Next.js 页面与 Route Handler 代理层
- `components/layout`
  统一页面框架、Header、Sidebar
- `components/feedback`
  页面加载态、空状态等公共反馈组件
- `lib/api`
  前端本地 `/api/*` 请求封装
- `lib/server`
  Next 服务端代理后端接口与数据映射
- `stores`
  Zustand 状态管理

## 建议保留的结构原则

- 页面负责组合，不承载大段业务逻辑
- API 调用统一走 `lib/api`
- 后端主实现继续以 `src/mvp` 为准
- 清理旧目录前先确认无引用，再删除
