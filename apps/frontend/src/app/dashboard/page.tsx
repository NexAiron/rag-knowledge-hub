"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Empty, Form, Input, Statistic, Tag, Typography } from "antd";
import { Layout } from "@/components/layout/layout";
import { KbCard } from "@/components/kb/kb-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";

interface CreateKbValues {
  name: string;
  description: string;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const isLoading = useKbStore((state) => state.isLoading);
  const isCreating = useKbStore((state) => state.isCreating);
  const error = useKbStore((state) => state.error);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const createKnowledgeBase = useKbStore((state) => state.createKnowledgeBase);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, knowledgeBases.length]);

  const handleCreate = async (values: CreateKbValues) => {
    await createKnowledgeBase({
      name: values.name.trim(),
      description: values.description.trim(),
    });
    setShowCreateForm(false);
  };

  const totalDocuments = knowledgeBases.reduce((sum, kb) => sum + kb.documentCount, 0);

  return (
    <Layout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
      action={
        <Button
          type="primary"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="!rounded-2xl !bg-ink !px-4 !text-xs !font-semibold shadow-lg shadow-ink/10"
        >
          {showCreateForm ? t("common.close") : t("dashboard.newKb")}
        </Button>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card bordered={false} className="glass-panel !rounded-[34px] !shadow-none" styles={{ body: { padding: 28 } }}>
            <Tag color="blue" bordered={false} className="!m-0 !rounded-full !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.22em]">
              {t("common.brand")}
            </Tag>
            <Typography.Title level={2} className="!mb-0 !mt-5 min-h-[5.5rem] max-w-3xl !text-[2rem] !font-semibold !tracking-[-0.05em] !text-ink lg:min-h-[6rem] lg:!text-[2.6rem] lg:!leading-[1.08]">
              {t("dashboard.heroTitle")}
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-4 min-h-[3.5rem] max-w-2xl !text-[13px] !leading-7 !text-ink/62">
              {t("dashboard.heroSubtitle")}
            </Typography.Paragraph>

            <div className="mt-6 flex flex-wrap gap-3">
              <Tag className="!m-0 !rounded-full !px-4 !py-2 !text-xs !font-semibold">{t("dashboard.badgeAuth")}</Tag>
              <Tag className="!m-0 !rounded-full !px-4 !py-2 !text-xs !font-semibold">Prisma + MySQL</Tag>
              <Tag className="!m-0 !rounded-full !px-4 !py-2 !text-xs !font-semibold">{t("dashboard.badgeParser")}</Tag>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <Card bordered={false} className="ambient-card !rounded-[24px] !shadow-none">
                <Statistic title={t("dashboard.metricKb")} value={knowledgeBases.length} />
              </Card>
              <Card bordered={false} className="ambient-card !rounded-[24px] !shadow-none">
                <Statistic title={t("dashboard.metricDocs")} value={totalDocuments} />
              </Card>
              <Card bordered={false} className="accent-panel !rounded-[24px] !shadow-none" styles={{ body: { color: "white" } }}>
                <Typography.Text className="!text-xs !uppercase !tracking-[0.18em] !text-white/70">
                  {t("dashboard.metricReady")}
                </Typography.Text>
                <Typography.Title level={4} className="!mb-0 !mt-3 !text-[15px] !font-semibold !text-white">
                  {t("dashboard.pipelineText")}
                </Typography.Title>
                <Typography.Paragraph className="!mb-0 !mt-2 !text-[11px] !leading-5 !text-white/72">
                  {t("dashboard.pipelineDesc")}
                </Typography.Paragraph>
              </Card>
            </div>
          </Card>

          <aside className="space-y-4">
            <Card bordered={false} className="accent-panel !rounded-[32px] !shadow-none" styles={{ body: { color: "white", padding: 20 } }}>
              <Typography.Text className="!text-[11px] !uppercase !tracking-[0.22em] !text-white/62">
                {t("dashboard.focusLabel")}
              </Typography.Text>
              <Typography.Title level={3} className="!mb-0 !mt-3 min-h-[3.25rem] !text-[1.55rem] !font-semibold !tracking-[-0.04em] !text-white">
                {t("dashboard.focusTitle")}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-3 min-h-[4.5rem] !text-[13px] !leading-6 !text-white/74">
                {t("dashboard.focusDesc")}
              </Typography.Paragraph>
            </Card>

            <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
              <Typography.Text className="!text-xs !font-semibold !uppercase !tracking-[0.18em] !text-ink/52">
                {t("dashboard.flowLabel")}
              </Typography.Text>
              <div className="mt-4 space-y-3 text-[13px] text-ink/64">
                {[t("dashboard.flow1"), t("dashboard.flow2"), t("dashboard.flow3")].map((item) => (
                  <Card key={item} size="small" className="!rounded-[22px] !border-ink/8 !bg-white/78 !shadow-none">
                    {item}
                  </Card>
                ))}
              </div>
            </Card>
          </aside>
        </section>

        {showCreateForm ? (
          <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
            <Typography.Title level={4} className="!mb-0 !text-lg !font-semibold">
              {t("dashboard.formTitle")}
            </Typography.Title>

            <Form<CreateKbValues>
              layout="vertical"
              className="!mt-4"
              onFinish={handleCreate}
              requiredMark={false}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Form.Item
                  label={t("dashboard.name")}
                  name="name"
                  rules={[{ required: true, message: t("dashboard.nameRequired") }]}
                >
                  <Input placeholder={t("dashboard.namePlaceholder")} />
                </Form.Item>

                <Form.Item
                  label={t("dashboard.descriptionLabel")}
                  name="description"
                  rules={[{ required: true, message: t("dashboard.descriptionRequired") }]}
                >
                  <Input placeholder={t("dashboard.descriptionPlaceholder")} />
                </Form.Item>
              </div>

              <Form.Item className="!mb-0 !mt-2">
                <div className="flex items-center gap-3">
                  <Button htmlType="submit" type="primary" loading={isCreating} className="!rounded-2xl !bg-ink !px-4 !text-xs !font-semibold shadow-lg shadow-ink/10">
                    {isCreating ? t("dashboard.creating") : t("common.create")}
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} className="!rounded-2xl">
                    {t("common.cancel")}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        ) : null}

        {error ? <Alert message={error} type="error" showIcon className="!rounded-2xl" /> : null}

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div>
            {isLoading ? (
              <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
                {t("dashboard.loading")}
              </Card>
            ) : knowledgeBases.length === 0 ? (
              <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
                <Empty description={t("sidebar.knowledgeBases")} />
              </Card>
            ) : (
              <section className="grid gap-4 md:grid-cols-2">
                {knowledgeBases.map((kb) => (
                  <KbCard key={kb.id} kb={kb} onSelect={selectKnowledgeBase} />
                ))}
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
              <Typography.Text className="!text-xs !font-semibold !uppercase !tracking-[0.18em] !text-ink/52">
                {t("dashboard.snapshotLabel")}
              </Typography.Text>
              <div className="mt-4 space-y-3">
                <Card size="small" className="!rounded-[22px] !border-ink/8 !bg-white/78 !shadow-none">
                  <Statistic title={t("dashboard.snapshotCollections")} value={knowledgeBases.length} />
                </Card>
                <Card size="small" className="!rounded-[22px] !border-ink/8 !bg-white/78 !shadow-none">
                  <Statistic title={t("dashboard.snapshotDocuments")} value={totalDocuments} />
                </Card>
              </div>
            </Card>
          </aside>
        </section>
      </div>
    </Layout>
  );
}
