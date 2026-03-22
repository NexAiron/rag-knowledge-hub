# Architecture

本文档描述当前项目在 MVP 阶段的系统结构、文档处理链路和前后端协作方式。

## 1. 总体架构

项目采用前后端分离：

- Frontend
  - Next.js 负责页面渲染、交互、API 代理和用户态恢复
- Backend
  - NestJS 提供认证、知识库、文档处理和检索相关接口
- Database
  - MySQL 存储用户、知识库、文档、chunk、会话和消息
- File Storage
  - 本地 `uploads` 目录保存原始文档文件

## 2. 核心业务链路

### 认证链路

1. 用户注册或登录
2. 后端校验账号信息
3. 返回 `access_token + user`
4. 前端代理层写入 `access_token` cookie
5. 前端通过 `/api/me` 恢复用户状态

### 知识库链路

1. 用户创建知识库
2. 知识库归属当前用户
3. 文档、会话、消息后续都关联到该知识库

### 文档处理链路

1. 用户上传 PDF / Markdown
2. Multer 将文件保存到 `uploads`
3. 写入 `Document`，状态为 `uploaded`
4. ingestion 流程启动，状态改为 `processing`
5. parser 解析文档
6. chunking 对文本进行切分
7. 写入 chunks 和 embeddings
8. 成功后状态更新为 `completed`
9. 失败则更新为 `failed` 并写入 `errorMessage`

## 3. Parser 与 Chunking

### Parser 统一输出

parser 输出统一结构：

- `title`
- `content`
- `blocks`

其中每个 block 包含：

- `title`
- `content`
- `page`
- `section`
- `order`

### Chunking 目标

chunking 会尽量保留 parser 提供的结构信息，并写入 `Chunk.metadata`，便于后续：

- 来源引用展示
- 回答可追溯
- 定位页码和章节

## 4. Embedding 策略

当前版本 embedding 存在 MySQL 的 `Chunk.embedding` JSON 字段中。

这样做的原因：

- 实现简单，适合 MVP
- 不依赖额外向量数据库
- Prisma 原生支持 JSON
- 后续可以平滑迁移到专用向量存储

## 5. 数据同步策略

### 数据库结构同步

后端启动脚本会自动执行：

- `prisma db push`
- `prisma generate`

目的是确保 schema 和数据库表结构尽量保持同步，避免空库直接运行业务代码。

### 前端状态同步

前端在以下场景会主动同步知识库和文档状态：

- 页面初始化
- 登录后恢复用户态
- 文档上传成功后
- 文档删除成功后
- 文档处理处于 `processing` 时轮询刷新

## 6. 权限模型

当前采用“用户只能访问自己的资源”原则：

- 用户只能操作自己的知识库
- 用户只能查看自己知识库下的文档
- 用户只能删除自己知识库下的文档
- 会话和消息同样归属于当前用户

权限校验主要在后端 service 层完成。

## 7. 前端 UI 结构

当前 UI 设计采用：

- 淡蓝色主题
- 中英文双语切换
- 统一字体基线
- 非平铺式布局
- 统一图标系统

主要界面分层：

- 登录 / 注册页：品牌区 + 表单区
- Dashboard：主视觉区 + 侧边说明区 + 内容区
- Documents：主操作区 + 实时状态区 + 文档列表
- Chat：会话区 + 消息区 + 来源区

## 8. 当前限制

当前版本仍属于 MVP，主要限制包括：

- 远程 MySQL 的网络稳定性会影响启动与联调
- Chat 主链路还可以继续加强
- sources 结构仍有继续扩展空间
- 暂未引入任务队列、监控和自动化测试

## 9. 后续建议

- 完成 chat 后端主链路和来源展示增强
- 补页面守卫和未登录保护
- 引入更稳定的数据库和部署方案
- 增加测试、日志和监控
