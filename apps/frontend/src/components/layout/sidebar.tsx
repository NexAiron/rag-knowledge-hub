"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
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
    <aside className="glass-panel hidden w-[320px] shrink-0 overflow-hidden rounded-[32px] p-5 lg:block">
      <div className="accent-panel rounded-[26px] p-5 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
          {t("common.brand")}
        </p>
        <h2 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.04em]">
          {t("sidebar.dashboard")}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/74">
          {t("sidebar.caption")}
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        <Link
          href="/dashboard"
          className={`block rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
            pathname === "/dashboard"
              ? "bg-ink text-white shadow-lg shadow-ink/10"
              : "ambient-card text-ink hover:-translate-y-0.5"
          }`}
        >
          {t("sidebar.dashboard")}
        </Link>
      </nav>

      <section className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
          {t("sidebar.knowledgeBases")}
        </h3>

        {isLoading ? (
          <p className="mt-3 text-xs text-ink/60">{t("sidebar.loading")}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {knowledgeBases.map((kb) => {
              const active = activeKbId === kb.id || pathname.startsWith(`/kb/${kb.id}`);
              return (
                <Link
                  key={kb.id}
                  href={`/kb/${kb.id}`}
                  onClick={() => selectKnowledgeBase(kb.id)}
                  className={`block rounded-[22px] px-4 py-3 text-sm transition ${
                    active
                      ? "bg-gradient-to-r from-ink via-[#273247] to-brand text-white shadow-lg shadow-brand/15"
                      : "ambient-card text-ink hover:-translate-y-0.5 hover:border-brand"
                  }`}
                >
                  <p className="truncate font-medium">{kb.name}</p>
                  <p
                    className={`mt-1 text-xs ${active ? "text-white/80" : "text-ink/60"}`}
                  >
                    {kb.documentCount} {t("sidebar.docs")}
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
