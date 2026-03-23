"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Boxes,
  FileStack,
  MessageSquareText,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { Layout } from "@/components/layout/layout";
import { KbCard } from "@/components/kb/kb-card";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";
import { useUserStore } from "@/stores/user-store";

interface CreateKbValues {
  name: string;
  description: string;
}

const dashboardCopy = {
  zh: {
    badge: "知识库",
    heroTitle: "先整理知识库，再接入文档和问答",
    heroDescription:
      "首页只保留知识库创建、概览和高频入口，减少无用信息干扰。",
    helper: "建议先按课程、专题或项目建立知识库，再逐步上传资料。",
    listTitle: "我的知识库",
    listDescription: "从这里可以直接进入详情、文档和问答，不需要绕路。",
    emptyHint: "先创建一个知识库，后续再补充文档内容并开始问答。",
    continueTitle: "继续使用",
    continueDescription: "直接进入最近的知识库，继续上传文档或开始提问。",
    openDocs: "文档",
    openChat: "问答",
    stats: {
      collections: "知识库数量",
      documents: "文档总数",
      average: "平均文档",
    },
    createSuccess: "知识库已创建",
    captions: {
      collections: "知识库",
      documents: "文档",
      average: "密度",
    },
  },
  en: {
    badge: "Knowledge Base",
    heroTitle: "Start with knowledge bases, then connect documents and chat",
    heroDescription:
      "Keep the home page focused on knowledge-base creation, overview, and high-frequency actions.",
    helper: "Create one knowledge base first, then add documents and grounded chat.",
    listTitle: "My Knowledge Bases",
    listDescription: "Jump directly into details, documents, or chat from here.",
    emptyHint:
      "Create your first knowledge base, then add documents when you are ready.",
    continueTitle: "Continue",
    continueDescription: "Jump back into a knowledge base and continue with documents or chat.",
    openDocs: "Documents",
    openChat: "Chat",
    stats: {
      collections: "Knowledge Bases",
      documents: "Documents",
      average: "Avg / KB",
    },
    createSuccess: "Knowledge base created",
    captions: {
      collections: "Bases",
      documents: "Docs",
      average: "Density",
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
  const user = useUserStore((state) => state.user);
  const hasBootstrapped = useUserStore((state) => state.hasBootstrapped);

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (hasBootstrapped && user && knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, hasBootstrapped, knowledgeBases.length, user]);

  const handleCreate = async (values: CreateKbValues) => {
    await createKnowledgeBase({
      name: values.name.trim(),
      description: values.description.trim(),
    });
    setShowCreateForm(false);
    message.success(copy.createSuccess);
  };

  const totalDocuments = knowledgeBases.reduce(
    (sum, kb) => sum + kb.documentCount,
    0,
  );
  const averageDocuments =
    knowledgeBases.length > 0
      ? Math.round(totalDocuments / knowledgeBases.length)
      : 0;
  const recentKnowledgeBase = knowledgeBases[0];

  const metrics = [
    {
      icon: Boxes,
      title: copy.stats.collections,
      caption: copy.captions.collections,
      value: knowledgeBases.length,
    },
    {
      icon: FileStack,
      title: copy.stats.documents,
      caption: copy.captions.documents,
      value: totalDocuments,
    },
    {
      icon: Sparkles,
      title: copy.stats.average,
      caption: copy.captions.average,
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
      <div className="space-y-5">
        <Card
          variant="borderless"
          className="dashboard-hero dashboard-hero-compact overflow-hidden !rounded-[32px] !shadow-none"
          styles={{ body: { padding: 22 } }}
        >
          <div className="dashboard-hero-simple">
            <div className="dashboard-copy-block dashboard-copy-block-compact">
              <Tag
                color="blue"
                variant="filled"
                className="!m-0 !inline-flex !items-center !gap-1.5 !rounded-full !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.22em]"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                {copy.badge}
              </Tag>
              <Typography.Title
                level={2}
                className="dashboard-hero-title dashboard-hero-title-compact !mb-0 !mt-4 !font-semibold !tracking-[-0.04em] !text-ink"
              >
                {copy.heroTitle}
              </Typography.Title>
              <Typography.Paragraph className="dashboard-hero-description dashboard-hero-description-compact !mb-0 !mt-3 !text-ink/76">
                {copy.heroDescription}
              </Typography.Paragraph>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="primary"
                onClick={() => setShowCreateForm((prev) => !prev)}
                className="dashboard-primary-button !h-10 !rounded-2xl !px-5 !text-sm !font-semibold shadow-none"
              >
                {showCreateForm ? t("common.close") : t("dashboard.newKb")}
              </Button>
              <div className="dashboard-inline-note dashboard-inline-note-compact">
                <span>{copy.helper}</span>
              </div>
            </div>

            <div className="dashboard-summary-grid">
              {metrics.map(({ icon: Icon, title, caption, value }) => (
                <div key={title} className="dashboard-summary-pill">
                  <div className="dashboard-icon-ring dashboard-icon-ring-compact">
                    <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.16em] !text-ink/46">
                      {caption}
                    </Typography.Text>
                    <Statistic title={title} value={value} />
                  </div>
                </div>
              ))}
            </div>

            {recentKnowledgeBase ? (
              <div className="dashboard-overview-row">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.16em] !text-ink/46">
                      {copy.continueTitle}
                    </Typography.Text>
                    <Typography.Title
                      level={4}
                      className="!mb-0 !mt-2 truncate !text-lg !font-semibold !text-ink"
                    >
                      {recentKnowledgeBase.name}
                    </Typography.Title>
                    <Typography.Paragraph className="!mb-0 !mt-2 !text-[13px] !leading-6 !text-ink/64">
                      {copy.continueDescription}
                    </Typography.Paragraph>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/kb/${recentKnowledgeBase.id}/documents`}>
                      <Button className="dashboard-secondary-button !rounded-2xl">
                        {copy.openDocs}
                      </Button>
                    </Link>
                    <Link href={`/kb/${recentKnowledgeBase.id}/chat`}>
                      <Button
                        type="primary"
                        icon={<MessageSquareText className="h-4 w-4" strokeWidth={2} />}
                        className="dashboard-primary-button !rounded-2xl shadow-none"
                      >
                        {copy.openChat}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        {showCreateForm ? (
          <Card
            variant="borderless"
            className="dashboard-form-panel !rounded-[28px] !shadow-none"
          >
            <Typography.Title
              level={4}
              className="!mb-0 !text-lg !font-semibold"
            >
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
                  rules={[
                    { required: true, message: t("dashboard.nameRequired") },
                  ]}
                >
                  <Input placeholder={t("dashboard.namePlaceholder")} />
                </Form.Item>

                <Form.Item
                  label={t("dashboard.descriptionLabel")}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: t("dashboard.descriptionRequired"),
                    },
                  ]}
                >
                  <Input placeholder={t("dashboard.descriptionPlaceholder")} />
                </Form.Item>
              </div>

              <Form.Item className="!mb-0 !mt-2">
                <div className="flex items-center gap-3">
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={isCreating}
                    className="dashboard-primary-button !rounded-2xl !px-4 !text-xs !font-semibold shadow-none"
                  >
                    {isCreating ? t("dashboard.creating") : t("common.create")}
                  </Button>
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    className="dashboard-secondary-button !rounded-2xl"
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        ) : null}

        {error ? (
          <Alert message={error} type="error" showIcon className="!rounded-2xl" />
        ) : null}

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Typography.Title
                level={3}
                className="!mb-0 !text-[1.4rem] !font-semibold !tracking-[-0.04em] !text-ink"
              >
                {copy.listTitle}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-1 max-w-[560px] !text-[13px] !leading-6 !text-ink/62">
                {copy.listDescription}
              </Typography.Paragraph>
            </div>
            <Tag
              variant="filled"
              className="dashboard-soft-tag !hidden !rounded-full md:!inline-flex"
            >
              {knowledgeBases.length}
            </Tag>
          </div>

          {isLoading ? (
            <Card
              variant="borderless"
              className="glass-panel !rounded-[28px] !shadow-none"
            >
              {t("dashboard.loading")}
            </Card>
          ) : knowledgeBases.length === 0 ? (
            <Card
              variant="borderless"
              className="dashboard-empty-state !rounded-[28px] !shadow-none"
            >
              <div className="flex flex-col items-center py-7 text-center">
                <div className="dashboard-empty-orb mb-5 flex h-14 w-14 items-center justify-center rounded-full">
                  <Plus className="h-6 w-6 text-brand" strokeWidth={2} />
                </div>
                <Empty
                  description={copy.listTitle}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <Typography.Paragraph className="!mb-0 !mt-2 max-w-md !text-[13px] !leading-6 !text-ink/58">
                  {copy.emptyHint}
                </Typography.Paragraph>
                <Button
                  type="primary"
                  onClick={() => setShowCreateForm(true)}
                  className="dashboard-primary-button !mt-5 !rounded-2xl !px-5 !text-xs !font-semibold shadow-none"
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
    </Layout>
  );
}
