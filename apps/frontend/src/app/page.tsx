import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-brand">NexAiron</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
        RAG Knowledge Hub
      </h1>
      <p className="mt-4 max-w-2xl text-base text-ink/80">
        基于 Next.js + NestJS 的前后端分离知识库问答系统脚手架，支持知识库管理、文档入库、召回与 SSE 流式回答。
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/chat/demo-session"
          className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white"
        >
          打开会话示例
        </Link>
        <Link
          href="/kb"
          className="rounded-xl border border-ink/20 bg-panel px-5 py-3 text-sm font-medium"
        >
          浏览知识库
        </Link>
      </div>
    </main>
  );
}

