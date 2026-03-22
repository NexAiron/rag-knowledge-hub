"use client";

import { useMemo, useState } from "react";
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
  const doc =
    source.doc ??
    source.title ??
    "";

  const content =
    source.content ??
    source.snippet ??
    "";

  const page =
    source.page !== undefined && source.page !== null
      ? String(source.page)
      : "-";

  return {
    id: source.id ?? `source-${index}`,
    doc,
    content,
    page,
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

  const toggleExpanded = (id: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="glass-panel rounded-[30px] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink/70">
          {t("chat.sources")}
        </h3>
        <span className="rounded-full border border-ink/10 bg-white/76 px-2.5 py-1 text-xs text-ink/60">
          {t("chat.status")}: {status}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-ink/55">{t("chat.sourcesPanelHint")}</p>

      {answer ? (
        <div className="mt-3 rounded-[24px] border border-ink/10 bg-white/75 px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink/55">
            {t("chat.relatedAnswer")}
          </p>
          <p className="mt-1 text-xs text-ink/75">{previewText(answer, 120)}</p>
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {displaySources.length === 0 ? (
          <p className="text-sm text-ink/60">
            {t("chat.noSources")}
          </p>
        ) : (
          displaySources.map((source) => {
            const isExpanded = Boolean(expandedMap[source.id]);
            const shownContent = isExpanded
              ? source.content || t("chat.noContent")
              : previewText(source.content || t("chat.noContent"));

            return (
              <article
                key={source.id}
                className="rounded-[24px] border border-ink/15 bg-white/78 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-ink/85">
                    {source.doc || t("chat.unknownDocument")}
                  </p>
                  <span className="rounded-full border border-ink/15 px-2 py-0.5 text-[11px] text-ink/60">
                    p.{source.page}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-ink/75">
                  {shownContent}
                </p>

                <button
                  type="button"
                  onClick={() => toggleExpanded(source.id)}
                  className="mt-2 text-xs font-medium text-brand hover:underline"
                >
                  {isExpanded ? t("chat.collapse") : t("chat.expand")}
                </button>
              </article>
            );
          })
        )}
      </div>
    </aside>
  );
}
