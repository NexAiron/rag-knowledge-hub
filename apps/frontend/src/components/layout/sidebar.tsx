"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useKbStore } from "@/stores/kb-store";

export function Sidebar() {
  const pathname = usePathname();
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const activeKbId = useKbStore((state) => state.activeKbId);
  const isLoading = useKbStore((state) => state.isLoading);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, knowledgeBases.length]);

  return (
    <aside className="hidden w-72 shrink-0 rounded-2xl border border-ink/15 bg-panel/95 p-4 lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        RAG Hub
      </p>

      <nav className="mt-5 space-y-2">
        <Link
          href="/dashboard"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
            pathname === "/dashboard"
              ? "bg-ink text-white"
              : "bg-bg/80 text-ink hover:bg-bg"
          }`}
        >
          Dashboard
        </Link>
      </nav>

      <section className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/65">
          Knowledge Bases
        </h3>

        {isLoading ? (
          <p className="mt-3 text-xs text-ink/60">Loading...</p>
        ) : (
          <div className="mt-3 space-y-2">
            {knowledgeBases.map((kb) => {
              const active = activeKbId === kb.id || pathname.startsWith(`/kb/${kb.id}`);
              return (
                <Link
                  key={kb.id}
                  href={`/kb/${kb.id}`}
                  onClick={() => selectKnowledgeBase(kb.id)}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-ink text-white"
                      : "border border-ink/10 bg-white/90 text-ink hover:border-brand"
                  }`}
                >
                  <p className="truncate font-medium">{kb.name}</p>
                  <p
                    className={`mt-1 text-xs ${active ? "text-white/80" : "text-ink/60"}`}
                  >
                    {kb.documentCount} docs
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </aside>
  );
}
