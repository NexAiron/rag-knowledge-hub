# 目录结构

## 顶层

```text
nexairon-rag-knowledge-hub
├─ apps
│  ├─ backend
│  └─ frontend
├─ docs
├─ docker
└─ README.md
```

## apps/backend

```text
apps/backend
├─ prisma
│  └─ schema.prisma
├─ src
│  └─ mvp
│     ├─ common
│     ├─ modules
│     │  ├─ auth
│     │  ├─ users
│     │  ├─ kb
│     │  ├─ documents
│     │  ├─ parser
│     │  └─ ingestion
│     └─ prisma
└─ uploads
```

## apps/frontend

```text
apps/frontend
├─ src
│  ├─ app
│  ├─ components
│  │  ├─ auth
│  │  ├─ chat
│  │  ├─ documents
│  │  ├─ kb
│  │  ├─ layout
│  │  ├─ providers
│  │  └─ theme
│  ├─ lib
│  ├─ stores
│  └─ types
├─ package.json
└─ tailwind.config.ts
```

## 重点目录说明

- `app`：Next.js 页面与 API 代理
- `components/providers`：Ant Design 全局 Provider
- `components/layout`：整体布局、Header、Sidebar、语言 / 主题切换
- `components/chat`：聊天 UI
- `stores`：Zustand 状态管理
- `lib/i18n`：中英文文案
