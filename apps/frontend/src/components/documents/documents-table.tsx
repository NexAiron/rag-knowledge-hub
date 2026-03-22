"use client";

import { Button, Empty, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  const { locale, t } = useI18n();

  const columns: ColumnsType<KnowledgeDocument> = [
    {
      title: t("documents.tableFile"),
      dataIndex: "fileName",
      key: "fileName",
      render: (_value, record) => (
        <div className="min-w-0">
          <Typography.Text className="!flex !items-center !gap-2 !text-sm !font-semibold !text-ink">
            <FileText className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <span className="truncate">{record.fileName}</span>
          </Typography.Text>
          <Typography.Text className="!mt-1 !block !text-xs !text-ink/52">
            {new Date(record.updatedAt).toLocaleString(
              locale === "zh" ? "zh-CN" : "en-US",
            )}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: t("documents.tableType"),
      dataIndex: "fileType",
      key: "fileType",
      width: 120,
      render: (value) => (
        <span className="uppercase text-[13px] text-ink/70">{value}</span>
      ),
    },
    {
      title: t("documents.tableSize"),
      dataIndex: "size",
      key: "size",
      width: 120,
      render: (value) => (
        <span className="text-[13px] text-ink/70">{formatSize(value)}</span>
      ),
    },
    {
      title: t("documents.tableStatus"),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (value) => <StatusTag status={value} />,
    },
    {
      title: t("documents.tableAction"),
      key: "action",
      width: 148,
      render: (_value, record) => (
        <Button
          danger
          icon={<Trash2 className="h-3.5 w-3.5" strokeWidth={2} />}
          loading={deletingId === record.id}
          onClick={() => onDelete(record.id)}
          className="!rounded-2xl"
        >
          {deletingId === record.id ? t("common.deleting") : t("common.delete")}
        </Button>
      ),
    },
  ];

  return (
    <div className="glass-panel overflow-hidden rounded-[30px] p-2">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={documents}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              description={t("documents.empty")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        className="documents-antd-table"
      />
    </div>
  );
}
