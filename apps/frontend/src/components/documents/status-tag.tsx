"use client";

import type { DocumentStatus } from "@/types";

interface StatusTagProps {
  status: DocumentStatus;
}

const statusStyleMap: Record<DocumentStatus, string> = {
  uploading: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const statusLabelMap: Record<DocumentStatus, string> = {
  uploading: "Uploading",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export function StatusTag({ status }: StatusTagProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyleMap[status]}`}
    >
      {statusLabelMap[status]}
    </span>
  );
}
