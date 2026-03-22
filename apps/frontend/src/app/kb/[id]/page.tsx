"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { Layout } from "@/components/layout/layout";
import { useKbStore } from "@/stores/kb-store";

export default function KnowledgeBaseDetailPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
  const { t } = useI18n();

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
      title={t("kb.detailTitle")}
      description={`${t("kb.currentId")}: ${kbId}`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/kb/${kbId}/documents`}
            className="rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
          >
            {t("kb.openDocuments")}
          </Link>
          <Link
            href={`/kb/${kbId}/chat`}
            className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
          >
            {t("kb.openChat")}
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1.55fr_0.95fr]">
        <article className="glass-panel overflow-hidden rounded-[32px] p-6 lg:p-7">
          <div className="accent-panel rounded-[28px] p-6 text-white">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">
              {t("common.knowledgeBases")}
            </p>
            <h2 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.05em] lg:text-[2.6rem]">
              {knowledgeBase?.name ?? t("kb.notFound")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/78">
              {knowledgeBase?.description ?? t("kb.notFoundHint")}
            </p>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-ink/75 sm:grid-cols-2">
            <div className="ambient-card rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                {t("kb.documentsCount")}
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">
                {knowledgeBase?.documentCount ?? 0}
              </p>
            </div>

            <div className="ambient-card rounded-[24px] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                {t("kb.updatedAt")}
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">
                {knowledgeBase?.updatedAt ?? "-"}
              </p>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="glass-panel rounded-[30px] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
              {t("kb.nextSteps")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/68">{t("kb.nextStepsContent")}</p>
          </div>

          <div className="glass-panel rounded-[30px] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
              {t("kb.statusTitle")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/68">{t("kb.statusContent")}</p>
          </div>
        </aside>
      </section>
    </Layout>
  );
}
