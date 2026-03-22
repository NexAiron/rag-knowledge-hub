"use client";

import Link from "next/link";
import { BookOpenText, Files, MessageSquareText } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import type { KnowledgeBase } from "@/types";

interface KbCardProps {
  kb: KnowledgeBase;
  onSelect?: (id: string) => void;
}

export function KbCard({ kb, onSelect }: KbCardProps) {
  const { t } = useI18n();

  return (
    <article className="glass-panel rounded-[30px] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/10">
      <Link
        href={`/kb/${kb.id}`}
        onClick={() => onSelect?.(kb.id)}
        className="block"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-ink">
            <BookOpenText className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            <span className="truncate">{kb.name}</span>
          </h2>
          <span className="rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
            {t("kb.card.badge")}
          </span>
        </div>
        <p className="mt-3 min-h-[52px] text-[13px] leading-6 text-ink/62">{kb.description}</p>
      </Link>

      <div className="mt-5 grid gap-2 rounded-[24px] border border-ink/8 bg-white/76 p-3 text-[11px] text-ink/65 sm:grid-cols-2">
        <span className="flex items-center gap-1.5">
          <Files className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          {kb.documentCount} {t("kb.card.documents")}
        </span>
        <span>{t("kb.card.updated")} {kb.updatedAt}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/kb/${kb.id}`}
          onClick={() => onSelect?.(kb.id)}
          className="rounded-2xl border border-ink/20 bg-white/78 px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
        >
          {t("kb.card.detail")}
        </Link>
        <Link
          href={`/kb/${kb.id}/chat`}
          onClick={() => onSelect?.(kb.id)}
          className="rounded-2xl bg-ink px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-1.5">
            <MessageSquareText className="h-3.5 w-3.5" strokeWidth={2} />
            {t("kb.card.chat")}
          </span>
        </Link>
      </div>
    </article>
  );
}
