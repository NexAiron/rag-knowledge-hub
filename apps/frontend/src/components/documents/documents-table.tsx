"use client";

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
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/15 bg-panel">
      <table className="w-full text-left text-sm">
        <thead className="bg-bg/80 text-xs uppercase tracking-wide text-ink/65">
          <tr>
            <th className="px-4 py-3">File</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} className="border-t border-ink/10">
              <td className="px-4 py-3">{document.fileName}</td>
              <td className="px-4 py-3 uppercase">{document.fileType}</td>
              <td className="px-4 py-3">{formatSize(document.size)}</td>
              <td className="px-4 py-3">
                <StatusTag status={document.status} />
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(document.id)}
                  disabled={deletingId === document.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-60"
                >
                  {deletingId === document.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
          {documents.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-ink/60">
                No documents yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
