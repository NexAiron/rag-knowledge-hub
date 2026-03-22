"use client";

import Link from "next/link";
import { BookOpenText, Files, MessageSquareText } from "lucide-react";
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
    <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none transition duration-200 hover:-translate-y-1">
      <Link href={`/kb/${kb.id}`} onClick={() => onSelect?.(kb.id)} className="block">
        <div className="flex items-start justify-between gap-3">
          <Typography.Title level={4} className="!mb-0 !flex !items-center !gap-2 !text-[15px] !font-semibold !tracking-[-0.02em] !text-ink">
            <BookOpenText className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <span className="truncate">{kb.name}</span>
          </Typography.Title>
          <Tag color="blue" className="!m-0 !rounded-full !px-2.5 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.14em]">
            {t("kb.card.badge")}
          </Tag>
        </div>
        <Typography.Paragraph className="!mb-0 !mt-3 min-h-[52px] !text-[13px] !leading-6 !text-ink/62">
          {kb.description}
        </Typography.Paragraph>
      </Link>

      <Card size="small" className="!mt-5 !rounded-[24px] !border-ink/8 !bg-white/76 !shadow-none">
        <div className="grid gap-2 text-[11px] text-ink/65 sm:grid-cols-2">
          <span className="flex items-center gap-1.5">
            <Files className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            {kb.documentCount} {t("kb.card.documents")}
          </span>
          <span>{t("kb.card.updated")} {kb.updatedAt}</span>
        </div>
      </Card>

      <div className="mt-4 flex gap-2">
        <Link href={`/kb/${kb.id}`} onClick={() => onSelect?.(kb.id)}>
          <Button className="!rounded-2xl">{t("kb.card.detail")}</Button>
        </Link>
        <Link href={`/kb/${kb.id}/chat`} onClick={() => onSelect?.(kb.id)}>
          <Button
            type="primary"
            icon={<MessageSquareText className="h-3.5 w-3.5" strokeWidth={2} />}
            className="!rounded-2xl !bg-ink shadow-lg shadow-ink/10"
          >
            {t("kb.card.chat")}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
