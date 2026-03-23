"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  FileStack,
  MessagesSquare,
} from "lucide-react";
import { Button, Card, Empty, Space, Statistic, Tag, Typography } from "antd";
import { Layout } from "@/components/layout/layout";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";

export default function KnowledgeBaseDetailPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
  const { t } = useI18n();

  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
    selectKnowledgeBase(kbId);
  }, [fetchKnowledgeBases, kbId, knowledgeBases.length, selectKnowledgeBase]);

  const knowledgeBase = knowledgeBases.find((item) => item.id === kbId);

  return (
    <Layout
      title={t("kb.detailTitle")}
      description={t("kb.heroDescription")}
      action={
        <div className="flex items-center gap-2">
          <Link href={`/kb/${kbId}/documents`}>
            <Button className="dashboard-secondary-button !rounded-2xl">
              {t("kb.openDocuments")}
            </Button>
          </Link>
          <Link href={`/kb/${kbId}/chat`}>
            <Button
              type="primary"
              className="dashboard-primary-button !rounded-2xl shadow-none"
            >
              {t("kb.openChat")}
            </Button>
          </Link>
        </div>
      }
    >
      {knowledgeBase ? (
        <div className="space-y-5">
          <Card
            bordered={false}
            className="dashboard-hero dashboard-hero-compact !rounded-[32px] !shadow-none"
            styles={{ body: { padding: 22 } }}
          >
            <div className="dashboard-hero-simple">
              <div className="dashboard-copy-block dashboard-copy-block-compact">
                  <Tag bordered={false} className="dashboard-soft-tag !m-0">
                    {t("kb.heroLabel")}
                  </Tag>
                  <Typography.Title
                    level={2}
                    className="dashboard-hero-title dashboard-hero-title-compact !mb-0 !mt-4 !text-ink"
                  >
                    {knowledgeBase.name}
                  </Typography.Title>
                  <Typography.Paragraph className="dashboard-hero-description dashboard-hero-description-compact !mb-0 !mt-3 !text-ink/66">
                    {knowledgeBase.description || t("kb.fallbackDescription")}
                  </Typography.Paragraph>

                  <Space className="!mt-5" size={12} wrap>
                    <Link href={`/kb/${kbId}/documents`}>
                      <Button
                        type="primary"
                        icon={<FileStack className="h-4 w-4" strokeWidth={2} />}
                        className="dashboard-primary-button !rounded-2xl shadow-none"
                      >
                        {t("kb.openDocuments")}
                      </Button>
                    </Link>
                    <Link href={`/kb/${kbId}/chat`}>
                      <Button
                        icon={
                          <MessagesSquare className="h-4 w-4" strokeWidth={2} />
                        }
                        className="dashboard-secondary-button !rounded-2xl"
                      >
                        {t("kb.openChat")}
                      </Button>
                    </Link>
                  </Space>
              </div>

              <div className="dashboard-summary-grid">
                <div className="dashboard-summary-pill">
                  <div className="min-w-0">
                    <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.16em] !text-ink/46">
                      {t("kb.documentsCount")}
                    </Typography.Text>
                    <Statistic value={knowledgeBase.documentCount} />
                  </div>
                </div>
                <div className="dashboard-summary-pill">
                  <div className="min-w-0">
                    <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.16em] !text-ink/46">
                      {t("kb.updatedAt")}
                    </Typography.Text>
                    <Typography.Paragraph className="!mb-0 !mt-2 !text-sm !font-semibold !text-ink">
                      {knowledgeBase.updatedAt}
                    </Typography.Paragraph>
                  </div>
                </div>
                <div className="dashboard-summary-pill">
                  <div className="min-w-0">
                    <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.16em] !text-ink/46">
                      ID
                    </Typography.Text>
                    <Typography.Paragraph className="!mb-0 !mt-2 !break-all !text-sm !font-medium !text-ink">
                      {kbId}
                    </Typography.Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card
              bordered={false}
              className="dashboard-side-panel !rounded-[30px] !shadow-none"
            >
              <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                {t("kb.infoTitle")}
              </Typography.Text>

              <div className="mt-4 grid gap-3">
                <div className="dashboard-overview-row">
                  <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/46">
                    {t("kb.name")}
                  </Typography.Text>
                  <Typography.Paragraph className="!mb-0 !mt-2 !text-sm !font-medium !text-ink">
                    {knowledgeBase.name}
                  </Typography.Paragraph>
                </div>
                <div className="dashboard-overview-row">
                  <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/46">
                    {t("kb.descriptionLabel")}
                  </Typography.Text>
                  <Typography.Paragraph className="!mb-0 !mt-2 !text-sm !leading-7 !text-ink/68">
                    {knowledgeBase.description || t("kb.fallbackDescription")}
                  </Typography.Paragraph>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card
                bordered={false}
                className="dashboard-side-panel !rounded-[30px] !shadow-none"
              >
                <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                  {t("kb.quickActions")}
                </Typography.Text>
                <Space direction="vertical" className="!mt-4 !w-full" size={10}>
                  <Link href={`/kb/${kbId}/documents`} className="block">
                    <Button
                      block
                      className="dashboard-secondary-button !justify-between !rounded-2xl"
                    >
                      <span>{t("kb.openDocuments")}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </Link>
                  <Link href={`/kb/${kbId}/chat`} className="block">
                    <Button
                      block
                      className="dashboard-secondary-button !justify-between !rounded-2xl"
                    >
                      <span>{t("kb.openChat")}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </Link>
                </Space>
              </Card>

              <Card
                bordered={false}
                className="dashboard-side-panel !rounded-[30px] !shadow-none"
              >
                <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                  {t("kb.statusTitle")}
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/62">
                  {t("kb.statusContent")}
                </Typography.Paragraph>
              </Card>
            </div>
          </section>
        </div>
      ) : (
        <Card
          bordered={false}
          className="glass-panel !rounded-[32px] !shadow-none"
        >
          <Empty description={t("kb.notFound")} />
        </Card>
      )}
    </Layout>
  );
}
