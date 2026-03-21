"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Layout } from "@/components/layout/layout";
import { DocumentsTable } from "@/components/documents/documents-table";
import { deleteDocument, listDocuments, uploadDocument } from "@/lib/api/documents";
import type { KnowledgeDocument } from "@/types";

function isSupportedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".md");
}

export default function DocumentsPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
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
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch documents.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [kbId]);

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
      setError("Only PDF and Markdown files are supported.");
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
      setDocuments((prev) =>
        prev.map((item) => (item.id === tempId ? created : item)),
      );
      void fetchDocuments();
    } catch (uploadError) {
      setDocuments((prev) => prev.filter((item) => item.id !== tempId));
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload document.",
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
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete document.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout
      title="Document Management"
      description={`Upload and manage files for KB: ${kbId}`}
      action={
        <Link
          href={`/kb/${kbId}`}
          className="rounded-lg border border-ink/20 px-4 py-2 text-xs font-medium"
        >
          Back to KB
        </Link>
      }
    >
      <div className="space-y-4">
        <section className="rounded-2xl border border-ink/15 bg-panel p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePickFile}
              disabled={isUploading}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Upload PDF / Markdown"}
            </button>
            <p className="text-xs text-ink/60">
              Supported types: `.pdf`, `.md`
            </p>
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
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <section className="rounded-2xl border border-ink/15 bg-panel p-5 text-sm text-ink/70">
            Loading documents...
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
