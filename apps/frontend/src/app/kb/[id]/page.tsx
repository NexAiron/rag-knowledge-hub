"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button, Card, Statistic, Tag, Typography } from "antd";
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
      description={`${t("kb.currentId")}: ${kbId}`}
      action={
        <div className="flex items-center gap-2">
          <Link href={`/kb/${kbId}/documents`}>
            <Button className="!rounded-2xl">{t("kb.openDocuments")}</Button>
          </Link>
          <Link href={`/kb/${kbId}/chat`}>
            <Button type="primary" className="!rounded-2xl !bg-ink shadow-lg shadow-ink/10">
              {t("kb.openChat")}
            </Button>
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 lg:grid-cols-[1.55fr_0.95fr]">
        <Card bordered={false} className="glass-panel !rounded-[32px] !shadow-none">
          <Card bordered={false} className="accent-panel !rounded-[28px] !shadow-none" styles={{ body: { padding: 24, color: "white" } }}>
            <Tag bordered={false} className="!m-0 !rounded-full !bg-white/10 !px-3 !py-1 !text-[11px] !uppercase !tracking-[0.22em] !text-white/68">
              {t("common.knowledgeBases")}
            </Tag>
            <Typography.Title level={2} className="!mb-0 !mt-3 !text-[2.1rem] !font-semibold !tracking-[-0.05em] !text-white lg:!text-[2.6rem]">
              {knowledgeBase?.name ?? t("kb.notFound")}
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-4 max-w-2xl !text-sm !leading-8 !text-white/78">
              {knowledgeBase?.description ?? t("kb.notFoundHint")}
            </Typography.Paragraph>
          </Card>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card bordered={false} className="ambient-card !rounded-[24px] !shadow-none">
              <Statistic title={t("kb.documentsCount")} value={knowledgeBase?.documentCount ?? 0} />
            </Card>
            <Card bordered={false} className="ambient-card !rounded-[24px] !shadow-none">
              <Statistic title={t("kb.updatedAt")} value={knowledgeBase?.updatedAt ?? "-"} />
            </Card>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
            <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
              {t("kb.nextSteps")}
            </Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-7 !text-ink/68">
              {t("kb.nextStepsContent")}
            </Typography.Paragraph>
          </Card>

          <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
            <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
              {t("kb.statusTitle")}
            </Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-7 !text-ink/68">
              {t("kb.statusContent")}
            </Typography.Paragraph>
          </Card>
        </aside>
      </section>
    </Layout>
  );
}
