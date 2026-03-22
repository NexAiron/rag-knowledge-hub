"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BookOpenText,
  Database,
  FileStack,
  MessagesSquare,
} from "lucide-react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
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
      description={`统一查看当前知识库的概览信息、文档入口与后续问答操作 · ${kbId}`}
      action={
        <div className="flex items-center gap-2">
          <Link href={`/kb/${kbId}/documents`}>
            <Button className="!rounded-2xl">{t("kb.openDocuments")}</Button>
          </Link>
          <Link href={`/kb/${kbId}/chat`}>
            <Button
              type="primary"
              className="!rounded-2xl !bg-ink shadow-lg shadow-ink/10"
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
            className="glass-panel !rounded-[32px] !shadow-none"
          >
            <Row gutter={[20, 20]} align="middle">
              <Col xs={24} xl={15}>
                <Tag
                  color="blue"
                  bordered={false}
                  className="!m-0 !rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.2em]"
                >
                  {t("common.knowledgeBases")}
                </Tag>
                <Typography.Title
                  level={2}
                  className="!mb-0 !mt-4 !text-[2rem] !font-semibold !tracking-[-0.04em] !text-ink lg:!text-[2.4rem]"
                >
                  {knowledgeBase.name}
                </Typography.Title>
                <Typography.Paragraph className="!mb-0 !mt-4 max-w-[760px] !text-[14px] !leading-7 !text-ink/62">
                  {knowledgeBase.description || t("kb.notFoundHint")}
                </Typography.Paragraph>

                <Space className="!mt-6" size={12} wrap>
                  <Link href={`/kb/${kbId}/documents`}>
                    <Button
                      type="primary"
                      icon={<FileStack className="h-4 w-4" strokeWidth={2} />}
                      className="!rounded-2xl !bg-ink shadow-lg shadow-ink/10"
                    >
                      {t("kb.openDocuments")}
                    </Button>
                  </Link>
                  <Link href={`/kb/${kbId}/chat`}>
                    <Button
                      icon={<MessagesSquare className="h-4 w-4" strokeWidth={2} />}
                      className="!rounded-2xl"
                    >
                      {t("kb.openChat")}
                    </Button>
                  </Link>
                </Space>
              </Col>

              <Col xs={24} xl={9}>
                <Card
                  bordered={false}
                  className="accent-panel !rounded-[28px] !shadow-none"
                  styles={{ body: { padding: 24, color: "white" } }}
                >
                  <Typography.Text className="!text-[11px] !uppercase !tracking-[0.18em] !text-white/68">
                    当前概览
                  </Typography.Text>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Card
                      bordered={false}
                      className="!rounded-[22px] !bg-white/10 !shadow-none"
                      styles={{ body: { padding: 16, color: "white" } }}
                    >
                      <Statistic
                        title={t("kb.documentsCount")}
                        value={knowledgeBase.documentCount}
                        valueStyle={{ color: "white" }}
                      />
                    </Card>
                    <Card
                      bordered={false}
                      className="!rounded-[22px] !bg-white/10 !shadow-none"
                      styles={{ body: { padding: 16, color: "white" } }}
                    >
                      <Typography.Text className="!text-xs !uppercase !tracking-[0.16em] !text-white/62">
                        {t("kb.updatedAt")}
                      </Typography.Text>
                      <Typography.Paragraph className="!mb-0 !mt-3 !text-base !font-semibold !text-white">
                        {knowledgeBase.updatedAt}
                      </Typography.Paragraph>
                    </Card>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card
              bordered={false}
              className="glass-panel !rounded-[30px] !shadow-none"
            >
              <Typography.Text className="!flex !items-center !gap-2 !text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                <Database className="h-4 w-4 text-brand" strokeWidth={2} />
                基本信息
              </Typography.Text>
              <Descriptions
                column={1}
                className="!mt-5"
                items={[
                  { key: "id", label: "知识库 ID", children: kbId },
                  { key: "name", label: "名称", children: knowledgeBase.name },
                  {
                    key: "description",
                    label: "描述",
                    children: knowledgeBase.description || "暂无描述",
                  },
                  {
                    key: "updatedAt",
                    label: t("kb.updatedAt"),
                    children: knowledgeBase.updatedAt,
                  },
                ]}
              />
            </Card>

            <div className="space-y-4">
              <Card
                bordered={false}
                className="glass-panel !rounded-[30px] !shadow-none"
              >
                <Typography.Text className="!flex !items-center !gap-2 !text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                  <BookOpenText className="h-4 w-4 text-brand" strokeWidth={2} />
                  {t("kb.nextSteps")}
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-7 !text-ink/68">
                  {t("kb.nextStepsContent")}
                </Typography.Paragraph>
                <Space direction="vertical" className="!mt-4 !w-full" size={10}>
                  <Link href={`/kb/${kbId}/documents`} className="block">
                    <Button block className="!justify-between !rounded-2xl">
                      <span>{t("kb.openDocuments")}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </Link>
                  <Link href={`/kb/${kbId}/chat`} className="block">
                    <Button block className="!justify-between !rounded-2xl">
                      <span>{t("kb.openChat")}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </Link>
                </Space>
              </Card>

              <Card
                bordered={false}
                className="glass-panel !rounded-[30px] !shadow-none"
              >
                <Typography.Text className="!text-sm !font-semibold !uppercase !tracking-[0.18em] !text-ink/70">
                  {t("kb.statusTitle")}
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-7 !text-ink/68">
                  {t("kb.statusContent")}
                </Typography.Paragraph>
              </Card>
            </div>
          </section>
        </div>
      ) : (
        <Card bordered={false} className="glass-panel !rounded-[32px] !shadow-none">
          <Empty description={t("kb.notFound")} />
        </Card>
      )}
    </Layout>
  );
}
