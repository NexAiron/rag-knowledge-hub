"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/layout";
import { DocumentsTable } from "@/components/documents/documents-table";
import { useI18n } from "@/lib/i18n/use-i18n";
import { deleteDocument, listDocuments, uploadDocument } from "@/lib/api/documents";
import { useKbStore } from "@/stores/kb-store";
import type { KnowledgeDocument } from "@/types";

function isSupportedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".md");
}

export default function DocumentsPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncKnowledgeBases = useKbStore((state) => state.syncKnowledgeBases);

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasPending = useMemo(
    () =>
      documents.some(
        (document) =>
          document.status === "uploading" || document.status === "processing",
      ),
    [documents],
  );

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await listDocuments(kbId);
      setDocuments(data);
      setError(null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : t("documents.fetchFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [kbId, t]);

  useEffect(() => {
    void fetchDocuments();
    void syncKnowledgeBases();
  }, [fetchDocuments, syncKnowledgeBases]);

  useEffect(() => {
    if (!hasPending) return undefined;
    const timer = window.setInterval(() => {
      void fetchDocuments();
      void syncKnowledgeBases();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [fetchDocuments, hasPending, syncKnowledgeBases]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedFile(file)) {
      setError(t("documents.unsupported"));
      event.target.value = "";
      return;
    }

    const now = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;
    const tempDocument: KnowledgeDocument = {
      id: tempId,
      kbId,
      fileName: file.name,
      fileType: file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "md",
      size: file.size,
      status: "uploading",
      createdAt: now,
      updatedAt: now,
    };

    setDocuments((prev) => [tempDocument, ...prev]);
    setIsUploading(true);
    setError(null);

    try {
      const created = await uploadDocument(kbId, file);
      setDocuments((prev) => prev.map((item) => (item.id === tempId ? created : item)));
      void syncKnowledgeBases();
      void fetchDocuments();
    } catch (uploadError) {
      setDocuments((prev) => prev.filter((item) => item.id !== tempId));
      setError(
        uploadError instanceof Error ? uploadError.message : t("documents.uploadFailed"),
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((item) => item.id !== id));
      void syncKnowledgeBases();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : t("documents.deleteFailed"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout
      title={t("documents.title")}
      description={`${t("documents.description")} · ${kbId}`}
      action={
        <Link
          href={`/kb/${kbId}`}
          className="min-w-[126px] rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-center text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
        >
          {t("documents.backToKb")}
        </Link>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="glass-panel overflow-hidden rounded-[32px] p-6 lg:p-7">
            <p className="inline-flex min-h-[28px] items-center rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
              {t("common.documents")}
            </p>
            <h2 className="mt-4 min-h-[2.25rem] text-[1.75rem] font-semibold tracking-[-0.04em] text-ink">
              {t("documents.title")}
            </h2>
            <p className="mt-3 min-h-[3.5rem] max-w-2xl text-[13px] leading-7 text-ink/62">
              {t("documents.description")}
            </p>

            <div className="mt-8 flex min-h-[42px] flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePickFile}
                disabled={isUploading}
                className="min-w-[188px] rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 disabled:opacity-60"
              >
                {isUploading ? t("common.uploading") : t("documents.uploadButton")}
              </button>
              <p className="text-xs text-ink/60">
                {t("common.supportedTypes")}: `.pdf`, `.md`
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.md,application/pdf,text/markdown"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <aside className="space-y-4">
            <div className="accent-panel rounded-[30px] p-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/62">{t("documents.flowLabel")}</p>
              <h3 className="mt-3 min-h-[3rem] text-[1.45rem] font-semibold tracking-[-0.04em]">
                {t("documents.flowTitle")}
              </h3>
              <p className="mt-3 min-h-[4.5rem] text-[13px] leading-6 text-white/74">
                {t("documents.flowDesc")}
              </p>
            </div>

            <div className="glass-panel rounded-[30px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/52">{t("documents.snapshotLabel")}</p>
              <div className="mt-4 grid gap-3">
                <div className="min-h-[92px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{t("documents.snapshotTotal")}</p>
                  <p className="mt-2 text-[1.65rem] font-semibold text-ink">{documents.length}</p>
                </div>
                <div className="min-h-[92px] rounded-[22px] border border-ink/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">{t("documents.snapshotProcessing")}</p>
                  <p className="mt-2 text-[1.65rem] font-semibold text-ink">
                    {documents.filter((item) => item.status === "processing").length}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <section className="glass-panel rounded-[30px] p-5 text-sm text-ink/70">
            {t("documents.loading")}
          </section>
        ) : (
          <DocumentsTable
            documents={documents}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
}
