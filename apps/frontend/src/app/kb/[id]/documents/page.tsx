"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { App, Alert, Button, Card, Empty, Statistic, Tag, Typography } from "antd";
import { DocumentsTable } from "@/components/documents/documents-table";
import { Layout } from "@/components/layout/layout";
import {
  deleteDocument,
  listDocuments,
  uploadDocument,
} from "@/lib/api/documents";
import { useI18n } from "@/lib/i18n/use-i18n";
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
  const { message } = App.useApp();
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

  const completedCount = useMemo(
    () => documents.filter((item) => item.status === "completed").length,
    [documents],
  );

  const formatLabel = useMemo(() => {
    const types = new Set(documents.map((item) => item.fileType.toUpperCase()));
    return types.size > 0 ? Array.from(types).join(" / ") : "PDF / MD";
  }, [documents]);

  const fetchDocuments = useCallback(async () => {
    try {
      const data = await listDocuments(kbId);
      setDocuments(data);
      setError(null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : t("documents.fetchFailed"),
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
      setDocuments((prev) =>
        prev.map((item) => (item.id === tempId ? created : item)),
      );
      message.success(t("documents.uploadSuccess"));
      void syncKnowledgeBases();
      void fetchDocuments();
    } catch (uploadError) {
      setDocuments((prev) => prev.filter((item) => item.id !== tempId));
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : t("documents.uploadFailed"),
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
      message.success(t("documents.deleteSuccess"));
      void syncKnowledgeBases();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : t("documents.deleteFailed"),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout
      title={t("documents.title")}
      description={t("documents.description")}
      action={
        <Link href={`/kb/${kbId}`}>
          <Button className="dashboard-secondary-button !rounded-2xl">
            {t("documents.backToKb")}
          </Button>
        </Link>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card
            variant="borderless"
            className="dashboard-hero dashboard-hero-compact !rounded-[32px] !shadow-none"
            styles={{ body: { padding: 22 } }}
          >
            <div className="dashboard-hero-simple">
              <div className="dashboard-copy-block dashboard-copy-block-compact">
                <Tag variant="filled" className="dashboard-soft-tag !m-0">
                  {t("common.documents")}
                </Tag>
                <Typography.Title
                  level={2}
                  className="dashboard-hero-title dashboard-hero-title-compact !mb-0 !mt-4 !text-ink"
                >
                  {t("documents.title")}
                </Typography.Title>
                <Typography.Paragraph className="dashboard-hero-description dashboard-hero-description-compact !mb-0 !mt-3 !text-ink/62">
                  {t("documents.description")}
                </Typography.Paragraph>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    type="primary"
                    onClick={() => fileInputRef.current?.click()}
                    loading={isUploading}
                    className="dashboard-primary-button !rounded-2xl shadow-none"
                  >
                    {isUploading
                      ? t("common.uploading")
                      : t("documents.uploadButton")}
                  </Button>
                  <span className="dashboard-inline-note">
                    {t("common.supportedTypes")}: `.pdf`, `.md`
                  </span>
                </div>
                <Typography.Paragraph className="!mb-0 !mt-3 !text-[12px] !leading-6 !text-ink/54">
                  {t("documents.panelHint")}
                </Typography.Paragraph>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.md,application/pdf,text/markdown"
              className="hidden"
              onChange={handleFileChange}
            />
          </Card>

          <aside className="space-y-4">
            <Card
              variant="borderless"
              className="dashboard-side-panel !rounded-[30px] !shadow-none"
            >
              <Typography.Text className="!text-xs !font-semibold !uppercase !tracking-[0.18em] !text-ink/52">
                {t("documents.snapshotLabel")}
              </Typography.Text>
              <div className="mt-4 grid gap-3">
                <Card
                  size="small"
                  className="dashboard-overview-row !rounded-[22px] !shadow-none"
                >
                  <Statistic
                    title={t("documents.snapshotTotal")}
                    value={documents.length}
                  />
                </Card>
                <Card
                  size="small"
                  className="dashboard-overview-row !rounded-[22px] !shadow-none"
                >
                  <Statistic
                    title={t("documents.snapshotProcessing")}
                    value={
                      documents.filter((item) => item.status === "processing")
                        .length
                    }
                  />
                </Card>
                <Card
                  size="small"
                  className="dashboard-overview-row !rounded-[22px] !shadow-none"
                >
                  <Statistic
                    title={t("documents.snapshotReady")}
                    value={completedCount}
                  />
                </Card>
                <Card
                  size="small"
                  className="dashboard-overview-row !rounded-[22px] !shadow-none"
                >
                  <Typography.Text className="!text-xs !uppercase !tracking-[0.16em] !text-ink/56">
                    {t("documents.snapshotFormats")}
                  </Typography.Text>
                  <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !font-semibold !text-ink">
                    {formatLabel}
                  </Typography.Paragraph>
                </Card>
              </div>
            </Card>
          </aside>
        </section>

        {error ? (
          <Alert
            message={error}
            type="error"
            showIcon
            className="!rounded-2xl"
          />
        ) : null}

        {isLoading ? (
          <Card
            variant="borderless"
            className="glass-panel !rounded-[30px] !shadow-none"
          >
            {t("documents.loading")}
          </Card>
        ) : documents.length === 0 ? (
          <Card
            variant="borderless"
            className="glass-panel !rounded-[30px] !shadow-none"
          >
            <Empty
              description={t("documents.empty")}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
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
