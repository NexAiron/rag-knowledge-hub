# Architecture

本文档描述当前项目在 MVP 阶段的系统架构与主要处理链路。

## 1. 总体架构

项目采用前后端分离：

- Frontend
  - Next.js 负责页面渲染、交互和 API 代理
- Backend
  - NestJS 提供认证、知识库、文档和 RAG 相关接口
- Database
  - MySQL 存储业务数据
- File Storage
  - 本地 `uploads` 目录保存原始文档文件

## 2. 当前数据存储策略

### MySQL

存储以下业务实体：

- 用户
- 知识库
- 文档
- Chunk
- 会话
- 消息

### Embedding 存储

当前版本 embedding 存在 MySQL 的 `Chunk.embedding` 字段中，使用 JSON 保存。

这样做的原因：

- 实现简单，便于快速落地 MVP
- 不依赖额外向量数据库
- Prisma 原生支持 JSON
- 后续可平滑迁移到专门的向量存储方案

## 3. 核心业务链路

### 认证链路

1. 用户注册或登录
2. 后端校验用户信息
3. 签发 JWT
4. 前端通过代理层保存 `access_token`
5. 后续请求通过 Bearer Token 调用后端接口

### 知识库链路

1. 用户创建知识库
2. 知识库归属于当前登录用户
3. 后续文档、会话都关联到知识库

### 文档处理链路

1. 前端上传 PDF / Markdown
2. 后端使用 Multer 保存文件到本地
3. 创建 `Document` 记录，状态为 `uploaded`
4. 进入 ingestion 流程，状态更新为 `processing`
5. 调用 parser 解析文档
6. 清洗文本并切分为 blocks / chunks
7. 生成 embedding 并写入 `Chunk`
8. 处理完成后更新文档状态为 `completed`
9. 出错则更新为 `failed`

## 4. Parser 与 Chunking

### Parser 输出结构

统一输出：

- `title`
- `content`
- `blocks`

其中每个 block 包含：

- `title`
- `content`
- `page`
- `section`
- `order`

### Chunking 设计

chunking 会基于 parser 输出继续切分文本，并尽量保留以下信息：

- 页码 `page`
- 章节 `section`
- 段落顺序 `order`

这些信息会进入 `Chunk.metadata`，便于后续：

- 引用来源展示
- 定位原始段落
- 提升回答可解释性

## 5. 检索链路

当前为基础版检索：

1. 对用户问题生成 embedding
2. 从当前知识库下的 chunks 中读取 embedding
3. 在应用层进行相似度计算
4. 按分数排序，返回 Top K

这是 MVP 方案，优点是实现简单、依赖少。

后续可升级为：

- 专用向量数据库
- 混合检索
- rerank

## 6. 权限模型

当前采用“用户只能访问自己的资源”原则：

- 用户只能操作自己的知识库
- 用户只能查看自己知识库下的文档
- 用户只能删除自己上传到自己知识库下的文档
- 用户只能访问自己的会话和消息

权限校验主要在后端 service 层完成。

## 7. 前后端联调方式

当前前端不是直接调用后端域名，而是：

1. 浏览器请求 Next.js 的 `/api/*`
2. Next.js Route Handler 读取 cookie 中的 `access_token`
3. 再转发到 NestJS `/api/*`

这样做的好处：

- 前端调用方式统一
- 更适合后续接入 SSR / Server Actions
- token 处理集中，减少前端页面重复逻辑

## 8. 当前限制

当前版本仍属于 MVP，存在以下限制：

- 后端启动依赖本地 MySQL 可用
- 文档解析能力偏基础
- PDF 页码尽量保留，但不是精排版级解析
- Chat 主链路尚未完全接到真实检索与生成流程
- 暂未引入任务队列和更完整的可观测性

## 9. 后续演进建议

- 引入数据库迁移与初始化文档
- 增加 refresh token
- 将 ingestion 改为异步队列任务
- 优化检索与来源引用结构
- 增加测试、日志和部署说明
