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

  return (
    <Layout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
      action={
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
        >
          {showCreateForm ? t("common.close") : t("dashboard.newKb")}
        </button>
      }
    >
      <div className="space-y-4">
        <section className="glass-panel overflow-hidden rounded-[34px] p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <div>
              <p className="inline-flex rounded-full border border-brand/15 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                {t("common.brand")}
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-ink lg:text-[3.2rem] lg:leading-[1.04]">
                {t("dashboard.heroTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-ink/68">
                {t("dashboard.heroSubtitle")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-xs font-semibold text-ink/70">
                  JWT Auth
                </div>
                <div className="rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-xs font-semibold text-ink/70">
                  Prisma + MySQL
                </div>
                <div className="rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-xs font-semibold text-ink/70">
                  Parser to Chunks
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="ambient-card rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                  {t("dashboard.metricKb")}
                </p>
                <p className="mt-3 text-3xl font-semibold text-ink">{knowledgeBases.length}</p>
              </div>

              <div className="ambient-card rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                  {t("dashboard.metricDocs")}
                </p>
                <p className="mt-3 text-3xl font-semibold text-ink">
                  {knowledgeBases.reduce((sum, kb) => sum + kb.documentCount, 0)}
                </p>
              </div>

              <div className="accent-panel rounded-[24px] p-4 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                  {t("dashboard.metricReady")}
                </p>
                <p className="mt-3 text-lg font-semibold">Upload · Parser · Chunking</p>
                <p className="mt-2 text-xs leading-6 text-white/72">
                  Source-aware ingestion flow is ready for the next chat layer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {showCreateForm ? (
          <form onSubmit={handleCreate} className="glass-panel rounded-[30px] p-5 lg:p-6">
            <h2 className="text-lg font-semibold">{t("dashboard.formTitle")}</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">{t("dashboard.name")}</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("dashboard.namePlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(201,94,45,0.08)]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">{t("dashboard.descriptionLabel")}</span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("dashboard.descriptionPlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(201,94,45,0.08)]"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 disabled:opacity-60"
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

        {isLoading ? (
          <section className="glass-panel rounded-[30px] p-5 text-sm text-ink/70">
            {t("dashboard.loading")}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {knowledgeBases.map((kb) => (
              <KbCard key={kb.id} kb={kb} onSelect={selectKnowledgeBase} />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
