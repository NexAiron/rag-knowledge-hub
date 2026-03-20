import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold">
          NexAiron RAG Hub
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/kb" className="rounded-lg border px-3 py-1.5">
            知识库
          </Link>
          <Link href="/chat/demo-session" className="rounded-lg border px-3 py-1.5">
            问答
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}

