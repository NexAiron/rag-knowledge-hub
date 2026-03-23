"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Files,
  MessageSquareText,
} from "lucide-react";
import { Button, Card, Tag, Typography } from "antd";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { KnowledgeBase } from "@/types";

interface KbCardProps {
  kb: KnowledgeBase;
  onSelect?: (id: string) => void;
}

export function KbCard({ kb, onSelect }: KbCardProps) {
  const { t } = useI18n();

  return (
    <Card
      variant="borderless"
      className="dashboard-kb-card !rounded-[30px] !shadow-none"
    >
      <div className="space-y-5">
        <Link
          href={`/kb/${kb.id}`}
          onClick={() => onSelect?.(kb.id)}
          className="block"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Typography.Text className="!flex !items-center !gap-2 !text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/48">
                <BookOpenText
                  className="h-4 w-4 shrink-0 text-brand"
                  strokeWidth={2}
                />
                {t("common.knowledgeBases")}
              </Typography.Text>
              <Typography.Title
                level={4}
                className="!mb-0 !mt-3 truncate !text-[18px] !font-semibold !tracking-[-0.04em] !text-ink"
              >
                {kb.name}
              </Typography.Title>
            </div>
            <Tag variant="filled" className="dashboard-soft-tag !m-0">
              {t("kb.card.badge")}
            </Tag>
          </div>

          <Typography.Paragraph className="!mb-0 !mt-4 min-h-[72px] !text-[14px] !leading-7 !text-ink/72">
            {kb.description || t("kb.fallbackDescription")}
          </Typography.Paragraph>
        </Link>

        <div className="dashboard-kb-meta">
          <div className="dashboard-kb-meta-item">
            <Files className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            <span>
              {kb.documentCount} {t("kb.card.documents")}
            </span>
          </div>
          <div className="dashboard-kb-meta-item">
            <ArrowUpRight className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            <span>
              {t("kb.card.updated")} {kb.updatedAt}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/kb/${kb.id}`}
            onClick={() => onSelect?.(kb.id)}
            className="flex-1"
          >
            <Button className="dashboard-secondary-button !w-full !rounded-2xl">
              {t("kb.card.detail")}
            </Button>
          </Link>
          <Link
            href={`/kb/${kb.id}/documents`}
            onClick={() => onSelect?.(kb.id)}
            className="flex-1"
          >
            <Button className="dashboard-secondary-button !w-full !rounded-2xl">
              {t("kb.card.docs")}
            </Button>
          </Link>
          <Link
            href={`/kb/${kb.id}/chat`}
            onClick={() => onSelect?.(kb.id)}
            className="flex-1"
          >
            <Button
              type="primary"
              icon={
                <MessageSquareText className="h-3.5 w-3.5" strokeWidth={2} />
              }
              className="dashboard-primary-button !w-full !rounded-2xl shadow-none"
            >
              {t("kb.card.chat")}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
