"use client";

import { FormEvent, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { Layout } from "@/components/layout/layout";
import { KbCard } from "@/components/kb/kb-card";
import { useKbStore } from "@/stores/kb-store";

export default function DashboardPage() {
  const { t } = useI18n();
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const isLoading = useKbStore((state) => state.isLoading);
  const isCreating = useKbStore((state) => state.isCreating);
  const error = useKbStore((state) => state.error);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const createKnowledgeBase = useKbStore((state) => state.createKnowledgeBase);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, knowledgeBases.length]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();

    if (!normalizedName) {
      setFormError(t("dashboard.nameRequired"));
      return;
    }

    if (!normalizedDescription) {
      setFormError(t("dashboard.descriptionRequired"));
      return;
    }

    try {
      await createKnowledgeBase({
        name: normalizedName,
        description: normalizedDescription,
      });
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch {
      // Error is handled by the store.
    }
  };

  const totalDocuments = knowledgeBases.reduce((sum, kb) => sum + kb.documentCount, 0);

  return (
    <Layout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
      action={
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="min-w-[136px] rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
        >
          {showCreateForm ? t("common.close") : t("dashboard.newKb")}
        </button>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="glass-panel overflow-hidden rounded-[34px] p-6 lg:p-8">
            <p className="inline-flex min-h-[28px] items-center rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
              {t("common.brand")}
            </p>
            <h2 className="mt-5 min-h-[5.5rem] max-w-3xl text-[2rem] font-semibold tracking-[-0.05em] text-ink lg:min-h-[6rem] lg:text-[2.6rem] lg:leading-[1.08]">
              {t("dashboard.heroTitle")}
            </h2>
            <p className="mt-4 min-h-[3.5rem] max-w-2xl text-[13px] leading-7 text-ink/62">
              {t("dashboard.heroSubtitle")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="min-w-[132px] rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-center text-xs font-semibold text-ink/70">
                {t("dashboard.badgeAuth")}
              </div>
              <div className="min-w-[132px] rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-center text-xs font-semibold text-ink/70">
                Prisma + MySQL
              </div>
              <div className="min-w-[132px] rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-center text-xs font-semibold text-ink/70">
                {t("dashboard.badgeParser")}
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="ambient-card min-h-[132px] rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                  {t("dashboard.metricKb")}
                </p>
                <p className="mt-3 text-[1.9rem] font-semibold text-ink">{knowledgeBases.length}</p>
              </div>
              <div className="ambient-card min-h-[132px] rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                  {t("dashboard.metricDocs")}
                </p>
                <p className="mt-3 text-[1.9rem] font-semibold text-ink">{totalDocuments}</p>
              </div>
              <div className="accent-panel min-h-[132px] rounded-[24px] p-4 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                  {t("dashboard.metricReady")}
                </p>
                <p className="mt-3 text-[15px] font-semibold">{t("dashboard.pipelineText")}</p>
                <p className="mt-2 text-[11px] leading-5 text-white/72">
                  {t("dashboard.pipelineDesc")}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="accent-panel rounded-[32px] p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">{t("dashboard.focusLabel")}</p>
              <h3 className="mt-3 min-h-[3.25rem] text-[1.55rem] font-semibold tracking-[-0.04em]">
                {t("dashboard.focusTitle")}
              </h3>
              <p className="mt-3 min-h-[4.5rem] text-[13px] leading-6 text-white/74">
                {t("dashboard.focusDesc")}
              </p>
            </div>

            <div className="glass-panel rounded-[30px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/52">{t("dashboard.flowLabel")}</p>
              <div className="mt-4 space-y-3 text-[13px] text-ink/64">
                <div className="min-h-[72px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  {t("dashboard.flow1")}
                </div>
                <div className="min-h-[72px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  {t("dashboard.flow2")}
                </div>
                <div className="min-h-[72px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  {t("dashboard.flow3")}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {showCreateForm ? (
          <form onSubmit={handleCreate} className="glass-panel rounded-[30px] p-5 lg:p-6">
            <h2 className="min-h-[28px] text-lg font-semibold">{t("dashboard.formTitle")}</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="inline-flex min-h-[20px] text-sm font-medium">{t("dashboard.name")}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("dashboard.namePlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(120,174,235,0.16)]"
                />
              </label>

              <label className="block">
                <span className="inline-flex min-h-[20px] text-sm font-medium">{t("dashboard.descriptionLabel")}</span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("dashboard.descriptionPlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(120,174,235,0.16)]"
                />
              </label>
            </div>

            <div className="mt-4 flex min-h-[40px] items-center gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="min-w-[108px] rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 disabled:opacity-60"
              >
                {isCreating ? t("dashboard.creating") : t("common.create")}
              </button>
              {formError ? <p className="text-xs text-red-600">{formError}</p> : null}
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            {isLoading ? (
              <section className="glass-panel rounded-[30px] p-5 text-sm text-ink/70">
                {t("dashboard.loading")}
              </section>
            ) : (
              <section className="grid gap-4 md:grid-cols-2">
                {knowledgeBases.map((kb) => (
                  <KbCard key={kb.id} kb={kb} onSelect={selectKnowledgeBase} />
                ))}
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="glass-panel rounded-[30px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/52">{t("dashboard.snapshotLabel")}</p>
              <div className="mt-4 space-y-3">
                <div className="min-h-[92px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{t("dashboard.snapshotCollections")}</p>
                  <p className="mt-2 text-[1.65rem] font-semibold text-ink">{knowledgeBases.length}</p>
                </div>
                <div className="min-h-[92px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{t("dashboard.snapshotDocuments")}</p>
                  <p className="mt-2 text-[1.65rem] font-semibold text-ink">{totalDocuments}</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
}
