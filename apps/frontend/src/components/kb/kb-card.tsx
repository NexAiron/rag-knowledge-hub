"use client";

import Link from "next/link";
import type { KnowledgeBase } from "@/types";

interface KbCardProps {
  kb: KnowledgeBase;
  onSelect?: (id: string) => void;
}

export function KbCard({ kb, onSelect }: KbCardProps) {
  return (
    <article className="rounded-2xl border border-ink/15 bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      <Link
        href={`/kb/${kb.id}`}
        onClick={() => onSelect?.(kb.id)}
        className="block"
      >
        <h2 className="text-lg font-semibold">{kb.name}</h2>
        <p className="mt-2 text-sm text-ink/70">{kb.description}</p>
      </Link>

      <div className="mt-4 flex items-center justify-between text-xs text-ink/65">
        <span>{kb.documentCount} docs</span>
        <span>Updated {kb.updatedAt}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/kb/${kb.id}`}
          onClick={() => onSelect?.(kb.id)}
          className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-medium"
        >
          View Detail
        </Link>
        <Link
          href={`/kb/${kb.id}/chat`}
          onClick={() => onSelect?.(kb.id)}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white"
        >
          Chat
        </Link>
      </div>
    </article>
  );
}
