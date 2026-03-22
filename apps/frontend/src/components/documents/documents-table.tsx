"use client";

import { FileText, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { KnowledgeDocument } from "@/types";
import { StatusTag } from "@/components/documents/status-tag";

interface DocumentsTableProps {
  documents: KnowledgeDocument[];
  deletingId: string | null;
  onDelete: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsTable({
  documents,
  deletingId,
  onDelete,
}: DocumentsTableProps) {
  const { t } = useI18n();

  return (
    <div className="glass-panel overflow-hidden rounded-[30px]">
      <div className="hidden grid-cols-[minmax(0,2fr)_120px_120px_140px_120px] gap-4 border-b border-ink/8 bg-white/62 px-5 py-4 text-xs uppercase tracking-[0.18em] text-ink/55 md:grid">
        <span>{t("documents.tableFile")}</span>
        <span>{t("documents.tableType")}</span>
        <span>{t("documents.tableSize")}</span>
        <span>{t("documents.tableStatus")}</span>
        <span>{t("documents.tableAction")}</span>
      </div>

      {documents.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-ink/60">{t("documents.empty")}</div>
      ) : (
        <div className="divide-y divide-ink/8">
          {documents.map((document) => (
            <div
              key={document.id}
              className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,2fr)_120px_120px_140px_120px] md:items-center"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                  <FileText className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                  <span className="truncate">{document.fileName}</span>
                </p>
                <p className="mt-1 text-xs text-ink/52">
                  {new Date(document.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="text-sm uppercase text-ink/70">{document.fileType}</div>
              <div className="text-sm text-ink/70">{formatSize(document.size)}</div>
              <div>
                <StatusTag status={document.status} />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onDelete(document.id)}
                  disabled={deletingId === document.id}
                  className="rounded-2xl border border-red-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  <span className="flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    {deletingId === document.id ? t("common.deleting") : t("common.delete")}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
