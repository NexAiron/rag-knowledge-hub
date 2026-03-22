"use client";

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
    <div className="glass-panel overflow-hidden rounded-[28px]">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/65 text-xs uppercase tracking-[0.18em] text-ink/55">
          <tr>
            <th className="px-4 py-3">{t("documents.tableFile")}</th>
            <th className="px-4 py-3">{t("documents.tableType")}</th>
            <th className="px-4 py-3">{t("documents.tableSize")}</th>
            <th className="px-4 py-3">{t("documents.tableStatus")}</th>
            <th className="px-4 py-3">{t("documents.tableAction")}</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} className="border-t border-ink/10 bg-white/35">
              <td className="px-4 py-3 font-medium text-ink">{document.fileName}</td>
              <td className="px-4 py-3 uppercase text-ink/70">{document.fileType}</td>
              <td className="px-4 py-3">{formatSize(document.size)}</td>
              <td className="px-4 py-3">
                <StatusTag status={document.status} />
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(document.id)}
                  disabled={deletingId === document.id}
                  className="rounded-2xl border border-red-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deletingId === document.id ? t("common.deleting") : t("common.delete")}
                </button>
              </td>
            </tr>
          ))}
          {documents.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-ink/60">
                {t("documents.empty")}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
