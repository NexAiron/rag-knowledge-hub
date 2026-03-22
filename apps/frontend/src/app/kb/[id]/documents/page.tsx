"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/layout";
import { DocumentsTable } from "@/components/documents/documents-table";
import { useI18n } from "@/lib/i18n/use-i18n";
import { deleteDocument, listDocuments, uploadDocument } from "@/lib/api/documents";
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
  }, [fetchDocuments]);

  useEffect(() => {
    if (!hasPending) return undefined;
    const timer = window.setInterval(() => {
      void fetchDocuments();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [fetchDocuments, hasPending]);

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
          className="rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
        >
          {t("documents.backToKb")}
        </Link>
      }
    >
      <div className="space-y-4">
        <section className="glass-panel overflow-hidden rounded-[32px] p-6 lg:p-7">
          <div className="grid gap-5 lg:grid-cols-[1.22fr_0.78fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-brand/15 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                {t("common.documents")}
              </p>
              <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-ink">
                {t("documents.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-ink/68">
                {t("documents.description")}
              </p>
            </div>

            <div className="ambient-card rounded-[26px] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePickFile}
                  disabled={isUploading}
                  className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 disabled:opacity-60"
                >
                  {isUploading ? t("common.uploading") : t("documents.uploadButton")}
                </button>
                <p className="text-xs text-ink/60">
                  {t("common.supportedTypes")}: `.pdf`, `.md`
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,application/pdf,text/markdown"
            className="hidden"
            onChange={handleFileChange}
          />
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
