"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, LayoutDashboard, LibraryBig } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";
import { BrandMark } from "./brand-mark";

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
        <div className="flex items-center gap-3">
          <BrandMark inverted />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70">
              {t("common.brand")}
            </p>
            <p className="mt-1 text-[11px] text-white/56">{t("sidebar.workspaceLabel")}</p>
          </div>
        </div>
        <h2 className="mt-3 text-[1.45rem] font-semibold tracking-[-0.04em]">
          {t("sidebar.dashboard")}
        </h2>
        <p className="mt-3 text-[13px] leading-6 text-white/74">
          {t("sidebar.caption")}
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        <Link
          href="/dashboard"
          className={`block rounded-[22px] px-4 py-3 text-[13px] font-semibold transition ${
            pathname === "/dashboard"
              ? "bg-ink text-white shadow-lg shadow-ink/10"
              : "ambient-card text-ink hover:-translate-y-0.5"
          }`}
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
            {t("sidebar.dashboard")}
          </span>
        </Link>
      </nav>

      <section className="mt-6">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
          <LibraryBig className="h-3.5 w-3.5" strokeWidth={2} />
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
                  className={`block rounded-[22px] px-4 py-3 text-[13px] transition ${
                    active
                      ? "bg-gradient-to-r from-ink via-[#27456b] to-brand text-white shadow-lg shadow-brand/15"
                      : "ambient-card text-ink hover:-translate-y-0.5 hover:border-brand"
                  }`}
                >
                  <p className="flex items-center gap-2 truncate font-medium">
                    <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    <span className="truncate">{kb.name}</span>
                  </p>
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
