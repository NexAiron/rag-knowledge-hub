# 架构说明

## 整体架构

项目采用前后端分离的 monorepo 结构：

- 前端：Next.js 15
- UI：Ant Design
- 后端：NestJS
- ORM：Prisma
- 数据库：MySQL

前端通过 Next Route Handler 代理后端接口，避免浏览器直接暴露后端地址与 token 处理细节。

## 主链路

### 1. 用户认证

- 用户在前端登录 / 注册
- 前端调用本地 `/api/login`、`/api/register`
- Next 服务端代理转发给后端 `/api/auth/*`
- 成功后写入 `access_token` cookie

### 2. 知识库创建

- 登录后进入 `/kb`
- 创建知识库
- 后端落库 `knowledge_bases`

### 3. 文档上传

- 在知识库文档页上传 PDF / Markdown
- 后端保存文件到 `uploads`
- 同时写入 `documents`
- 文档状态初始为 `uploaded`

### 4. ingestion 流程

- 文档进入 `processing`
- parser 解析原始文件
- chunking 生成文本分片
- embedding provider 生成向量
- chunk 与 embedding 存入 `chunks`
- 成功后状态更新为 `completed`
- 失败后状态更新为 `failed`

### 5. RAG 问答

- 用户在聊天页提问
- 系统按知识库范围检索 `topK` chunk
- 组装 prompt 与历史消息
- 调用 LLM provider
- 返回回答和来源引用
- 保存会话与消息记录

## Provider 设计

后端已做模型与向量 provider 抽象：

- LLM provider
  - `mock`
  - `qwen`
- Embedding provider
  - `mock`
  - `qwen`

这样可以在不改 controller 的前提下切换底层模型实现。

## 当前实现特点

### 已具备

- 基础认证闭环
- 知识库、文档、聊天主链路
- SSE 流式聊天
- 来源引用展示
- mock / Qwen 双 provider 入口

### 当前限制

- retrieval 仍在应用层做向量相似度计算
- ingestion 仍是进程内异步触发，不是可靠任务队列
- 旧代码目录尚未完成最终清理

## 推荐的后续演进方向

### 短期

- 继续统一前端请求层与页面反馈组件
- 清理旧目录和本地运行产物
- 明确 `sources / citations` 的最终对外字段

### 中期

- 将 ingestion 迁移到可靠队列
- 升级 retrieval 到真正的向量检索方案
- 增加更多问答与上传链路测试
