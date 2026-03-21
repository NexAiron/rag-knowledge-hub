"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Layout } from "@/components/layout/layout";
import { useKbStore } from "@/stores/kb-store";

export default function KnowledgeBaseDetailPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;

  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
    selectKnowledgeBase(kbId);
  }, [fetchKnowledgeBases, kbId, knowledgeBases.length, selectKnowledgeBase]);

  const knowledgeBase = knowledgeBases.find((item) => item.id === kbId);

  return (
    <Layout
      title="Knowledge Base Detail"
      description={`Current KB ID: ${kbId}`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/kb/${kbId}/documents`}
            className="rounded-lg border border-ink/20 px-4 py-2 text-xs font-medium"
          >
            Documents
          </Link>
          <Link
            href={`/kb/${kbId}/chat`}
            className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white"
          >
            Open Chat
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-ink/15 bg-panel p-5">
          <h2 className="text-lg font-semibold">
            {knowledgeBase?.name ?? "Knowledge base not found"}
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            {knowledgeBase?.description ?? "Please return to dashboard and choose one."}
          </p>

          <div className="mt-4 grid gap-2 text-sm text-ink/75 sm:grid-cols-2">
            <p className="rounded-lg bg-bg/70 px-3 py-2">
              Documents: {knowledgeBase?.documentCount ?? 0}
            </p>
            <p className="rounded-lg bg-bg/70 px-3 py-2">
              Updated: {knowledgeBase?.updatedAt ?? "-"}
            </p>
          </div>
        </article>

        <aside className="rounded-2xl border border-ink/15 bg-panel p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/70">
            Next Steps
          </h3>
          <p className="mt-2 text-sm text-ink/70">
            You can extend this page with document list, chunk stats, and retrieval
            settings.
          </p>
        </aside>
      </section>
    </Layout>
  );
}
