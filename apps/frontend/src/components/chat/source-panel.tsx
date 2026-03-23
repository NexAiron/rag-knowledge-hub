"use client";

import { BookMarked, FileSearch, PanelRightOpen, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Empty, Tag, Typography } from "antd";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { SourceChunk } from "@/types";

interface SourcePanelProps {
  status: "idle" | "streaming" | "done" | "error";
  answer?: string;
  sources: SourceChunk[];
}

interface DisplaySource {
  id: string;
  doc: string;
  content: string;
  page: string;
}

function toDisplaySource(source: SourceChunk, index: number): DisplaySource {
  return {
    id: source.id ?? `source-${index}`,
    doc: source.doc ?? source.title ?? "",
    content: source.content ?? source.snippet ?? "",
    page:
      source.page !== undefined && source.page !== null ? String(source.page) : "-",
  };
}

function previewText(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function SourcePanel({ status, answer, sources }: SourcePanelProps) {
  const { t } = useI18n();
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const displaySources = useMemo(
    () => sources.map((item, index) => toDisplaySource(item, index)),
    [sources],
  );

  return (
    <Card
      variant="borderless"
      className="dashboard-side-panel !rounded-[30px] !shadow-none"
    >
      <div className="flex items-center justify-between gap-3">
        <Typography.Text className="!flex !items-center !gap-2 !text-sm !font-semibold !uppercase !tracking-wide !text-ink/70">
          <PanelRightOpen className="h-4 w-4 text-brand" strokeWidth={2} />
          {t("chat.sources")}
        </Typography.Text>
        <Tag className="!rounded-full">
          {t(`chat.sourceStatus.${status}`)}
        </Tag>
      </div>
      <Typography.Paragraph className="!mb-0 !mt-3 !text-xs !leading-5 !text-ink/55">
        {t("chat.sourcesPanelHint")}
      </Typography.Paragraph>

      {answer ? (
        <Card
          size="small"
          className="dashboard-overview-row !mt-4 !rounded-[24px] !shadow-none"
        >
          <Typography.Text className="!flex !items-center !gap-1.5 !text-[11px] !font-medium !uppercase !tracking-wide !text-ink/55">
            <Sparkles className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            {t("chat.relatedAnswer")}
          </Typography.Text>
          <Typography.Paragraph className="!mb-0 !mt-2 !text-xs !text-ink/75">
            {previewText(answer, 120)}
          </Typography.Paragraph>
        </Card>
      ) : null}

      <div className="mt-4 space-y-3">
        {displaySources.length === 0 ? (
          <Empty
            description={t("chat.noSources")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          displaySources.map((source) => {
            const isExpanded = Boolean(expandedMap[source.id]);
            const shownContent = isExpanded
              ? source.content || t("chat.noContent")
              : previewText(source.content || t("chat.noContent"));

            return (
              <Card
                key={source.id}
                size="small"
                className="dashboard-overview-row !rounded-[24px] !shadow-none"
              >
                <div className="flex items-center justify-between gap-2">
                  <Typography.Text className="!flex !items-center !gap-1.5 !text-xs !font-semibold !text-ink/85">
                    <BookMarked
                      className="h-3.5 w-3.5 shrink-0 text-brand"
                      strokeWidth={2}
                    />
                    {source.doc || t("chat.unknownDocument")}
                  </Typography.Text>
                  <Tag className="!rounded-full">p.{source.page}</Tag>
                </div>

                <Typography.Paragraph className="!mb-0 !mt-2 !whitespace-pre-wrap !text-xs !leading-5 !text-ink/75">
                  {shownContent}
                </Typography.Paragraph>

                <Button
                  type="link"
                  icon={<FileSearch className="h-3.5 w-3.5" strokeWidth={2} />}
                  onClick={() =>
                    setExpandedMap((prev) => ({
                      ...prev,
                      [source.id]: !prev[source.id],
                    }))
                  }
                  className="!mt-2 !px-0"
                >
                  {isExpanded ? t("chat.collapse") : t("chat.expand")}
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </Card>
  );
}
