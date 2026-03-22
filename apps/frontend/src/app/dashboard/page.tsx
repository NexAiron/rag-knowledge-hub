"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  FileStack,
  MessageSquareText,
  Plus,
  ScanSearch,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Alert, App, Button, Card, Empty, Form, Input, Statistic, Tag, Typography } from "antd";
import { Layout } from "@/components/layout/layout";
import { KbCard } from "@/components/kb/kb-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";

interface CreateKbValues {
  name: string;
  description: string;
}

const dashboardCopy = {
  zh: {
    badge: "AI Knowledge Hub",
    heroTitle: "知识工作台",
    heroDescription: "集中管理知识库、资料接入与问答入口，让首页只承载最核心的工作视图。",
    helper: "从一个清晰的知识库开始，再逐步扩展内容与问答场景。",
    listTitle: "知识库",
    listDescription: "保留最核心的集合入口，其他流程信息放到右侧辅助区。",
    statusTitle: "流程状态",
    statusDescription: "首页只显示接入主链路，避免把不相关信息都堆在主区域。",
    snapshotTitle: "当前概览",
    emptyHint: "先创建一个知识库，再逐步接入文档和问答能力。",
    steps: [
      { title: "上传接入", detail: "文档进入系统" },
      { title: "解析清洗", detail: "结构与文本统一" },
      { title: "切块检索", detail: "为问答提供索引" },
    ],
    stats: {
      collections: "知识库数量",
      documents: "文档总数",
      average: "平均文档",
    },
  },
  en: {
    badge: "AI Knowledge Hub",
    heroTitle: "Knowledge Workspace",
    heroDescription: "Manage knowledge bases, content intake, and QA entry points in one restrained overview.",
    helper: "Start with one clear knowledge base, then expand content and chat workflows gradually.",
    listTitle: "Knowledge Bases",
    listDescription: "Keep the main area focused on core collections and move support details to the side panel.",
    statusTitle: "Pipeline Status",
    statusDescription: "The dashboard keeps only the primary ingestion chain instead of stacking unrelated details.",
    snapshotTitle: "Current Snapshot",
    emptyHint: "Create your first knowledge base, then connect documents and grounded chat step by step.",
    steps: [
      { title: "Upload", detail: "Bring files into the workspace" },
      { title: "Parse", detail: "Normalize structure and text" },
      { title: "Retrieve", detail: "Prepare indexed chunks for QA" },
    ],
    stats: {
      collections: "Collections",
      documents: "Documents",
      average: "Avg / KB",
    },
  },
} as const;

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const { message } = App.useApp();
  const copy = dashboardCopy[locale];
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
    message.success(locale === "zh" ? "知识库已创建" : "Knowledge base created");
  };

  const totalDocuments = knowledgeBases.reduce((sum, kb) => sum + kb.documentCount, 0);
  const averageDocuments = knowledgeBases.length > 0 ? Math.round(totalDocuments / knowledgeBases.length) : 0;

  const metrics = [
    {
      icon: Boxes,
      title: copy.stats.collections,
      caption: "Collections",
      value: knowledgeBases.length,
    },
    {
      icon: FileStack,
      title: copy.stats.documents,
      caption: "Documents",
      value: totalDocuments,
    },
    {
      icon: MessageSquareText,
      title: copy.stats.average,
      caption: "Density",
      value: averageDocuments,
    },
  ];

  return (
    <Layout
      title={t("dashboard.title")}
      description={t("dashboard.description")}
      action={
        <Button
          type="primary"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="dashboard-primary-button !rounded-2xl !px-4 !text-xs !font-semibold shadow-none"
        >
          {showCreateForm ? t("common.close") : t("dashboard.newKb")}
        </Button>
      }
    >
      <div className="dashboard-main-grid">
        <div className="space-y-6">
          <Card
            bordered={false}
            className="dashboard-hero overflow-hidden !rounded-[36px] !shadow-none"
            styles={{ body: { padding: 28 } }}
          >
            <div className="dashboard-hero-simple">
              <div className="dashboard-copy-block">
                <Tag
                  color="blue"
                  bordered={false}
                  className="!m-0 !inline-flex !items-center !gap-1.5 !rounded-full !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.22em]"
                >
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                  {copy.badge}
                </Tag>
                <Typography.Title level={2} className="dashboard-hero-title !mb-0 !mt-5 !font-semibold !tracking-[-0.06em] !text-ink">
                  {copy.heroTitle}
                </Typography.Title>
                <Typography.Paragraph className="dashboard-hero-description !mb-0 !mt-4 !text-ink/76">
                  {copy.heroDescription}
                </Typography.Paragraph>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="primary"
                  onClick={() => setShowCreateForm((prev) => !prev)}
                  className="dashboard-primary-button !h-11 !rounded-2xl !px-6 !text-sm !font-semibold shadow-none"
                >
                  {showCreateForm ? t("common.close") : t("dashboard.newKb")}
                </Button>
                <div className="dashboard-inline-note">
                  <span>{copy.helper}</span>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {metrics.map(({ icon: Icon, title, caption, value }) => (
                  <Card key={title} bordered={false} className="dashboard-metric-card !rounded-[28px] !shadow-none">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/50">
                            {caption}
                          </Typography.Text>
                          <Statistic title={title} value={value} />
                        </div>
                        <div className="dashboard-icon-ring">
                          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {showCreateForm ? (
            <Card bordered={false} className="dashboard-form-panel !rounded-[32px] !shadow-none">
              <Typography.Title level={4} className="!mb-0 !text-lg !font-semibold">
                {t("dashboard.formTitle")}
              </Typography.Title>

              <Form<CreateKbValues>
                layout="vertical"
                className="!mt-5"
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
                    <Button htmlType="submit" type="primary" loading={isCreating} className="dashboard-primary-button !rounded-2xl !px-4 !text-xs !font-semibold shadow-none">
                      {isCreating ? t("dashboard.creating") : t("common.create")}
                    </Button>
                    <Button onClick={() => setShowCreateForm(false)} className="dashboard-secondary-button !rounded-2xl">
                      {t("common.cancel")}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          ) : null}

          {error ? <Alert message={error} type="error" showIcon className="!rounded-2xl" /> : null}

          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Typography.Title level={3} className="!mb-0 !text-[1.5rem] !font-semibold !tracking-[-0.04em] !text-ink">
                  {copy.listTitle}
                </Typography.Title>
                <Typography.Paragraph className="!mb-0 !mt-2 max-w-[620px] !text-[14px] !leading-7 !text-ink/66">
                  {copy.listDescription}
                </Typography.Paragraph>
              </div>
              <Tag bordered={false} className="dashboard-soft-tag !hidden !rounded-full md:!inline-flex">
                {knowledgeBases.length}
              </Tag>
            </div>

            {isLoading ? (
              <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
                {t("dashboard.loading")}
              </Card>
            ) : knowledgeBases.length === 0 ? (
              <Card bordered={false} className="dashboard-empty-state !rounded-[34px] !shadow-none">
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="dashboard-empty-orb mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                    <Plus className="h-7 w-7 text-brand" strokeWidth={2} />
                  </div>
                  <Empty description={copy.listTitle} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  <Typography.Paragraph className="!mb-0 !mt-2 max-w-md !text-[13px] !leading-6 !text-ink/58">
                    {copy.emptyHint}
                  </Typography.Paragraph>
                  <Button
                    type="primary"
                    onClick={() => setShowCreateForm(true)}
                    className="dashboard-primary-button !mt-6 !rounded-2xl !px-5 !text-xs !font-semibold shadow-none"
                  >
                    {t("dashboard.newKb")}
                  </Button>
                </div>
              </Card>
            ) : (
              <section className="grid gap-4 xl:grid-cols-2">
                {knowledgeBases.map((kb) => (
                  <KbCard key={kb.id} kb={kb} onSelect={selectKnowledgeBase} />
                ))}
              </section>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <Card bordered={false} className="dashboard-side-panel !rounded-[32px] !shadow-none" styles={{ body: { padding: 24 } }}>
            <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.22em] !text-ink/52">
              {copy.statusTitle}
            </Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/66">
              {copy.statusDescription}
            </Typography.Paragraph>
            <div className="mt-5 space-y-3">
              {copy.steps.map((step, index) => {
                const Icon = index === 0 ? FileStack : index === 1 ? ScanSearch : Workflow;
                return (
                  <div key={step.title} className="dashboard-process-card">
                    <div className="flex items-start gap-3">
                      <div className="dashboard-process-icon">
                        <Icon className="h-4 w-4 text-brand" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <Typography.Text className="!block !text-sm !font-semibold !text-ink">
                          {step.title}
                        </Typography.Text>
                        <Typography.Paragraph className="!mb-0 !mt-1 !text-[12px] !leading-6 !text-ink/62">
                          {step.detail}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card bordered={false} className="dashboard-side-panel !rounded-[32px] !shadow-none" styles={{ body: { padding: 24 } }}>
            <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.22em] !text-ink/52">
              {copy.snapshotTitle}
            </Typography.Text>
            <div className="mt-5 space-y-3">
              <div className="dashboard-overview-row">
                <Statistic title={copy.stats.collections} value={knowledgeBases.length} />
              </div>
              <div className="dashboard-overview-row">
                <Statistic title={copy.stats.documents} value={totalDocuments} />
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </Layout>
  );
}
