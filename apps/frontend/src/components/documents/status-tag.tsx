"use client";

import { Tag } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  UploadCloud,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { DocumentStatus } from "@/types";

interface StatusTagProps {
  status: DocumentStatus;
}

const statusColorMap: Record<DocumentStatus, string> = {
  uploading: "blue",
  uploaded: "processing",
  processing: "gold",
  completed: "success",
  failed: "error",
};

const statusIconMap: Record<DocumentStatus, typeof UploadCloud> = {
  uploading: UploadCloud,
  uploaded: UploadCloud,
  processing: LoaderCircle,
  completed: CheckCircle2,
  failed: AlertCircle,
};

export function StatusTag({ status }: StatusTagProps) {
  const { t } = useI18n();
  const Icon = statusIconMap[status] ?? Clock3;

  return (
    <Tag
      color={statusColorMap[status]}
      className="!m-0 !inline-flex !items-center !gap-1.5 !rounded-full !px-2.5 !py-1 !text-xs !font-medium"
    >
      <Icon
        className={`h-3.5 w-3.5 ${status === "processing" ? "animate-spin" : ""}`}
        strokeWidth={2}
      />
      {t(`status.${status}`)}
    </Tag>
  );
}
