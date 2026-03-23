# 架构说明

## 整体结构

项目采用前后端分离架构：

- 前端：Next.js 15
- UI：Ant Design
- 后端：NestJS
- ORM：Prisma
- 数据库：MySQL

## 前端职责

- 登录、注册、工作台、知识库、文档、聊天页面
- 通过 `/api/*` route handler 代理后端接口
- 使用 Zustand 管理登录态、知识库状态、聊天状态
- 使用 Ant Design 统一表单、按钮、卡片、表格、标签、提示

## 后端职责

- 认证：注册、登录、JWT、`auth/me`
- 知识库：创建、查询、详情、删除
- 文档：上传、列表、删除
- parser：Markdown / PDF 解析
- ingestion：文档状态推进、切块、入库

## 数据流

1. 前端上传文档
2. 后端保存文件与文档元信息
3. ingestion 触发解析
4. parser 输出标准化文本块
5. chunking 生成 chunks
6. chunks 与 embeddings 入库
7. 前端轮询文档状态并同步知识库统计

## 主题与展示

- 主色：淡蓝色
- 支持浅色 / 暗黑模式
- 支持中文 / 英文切换
- 页面布局以 Ant Design 组件为主，辅以少量自定义外观层
