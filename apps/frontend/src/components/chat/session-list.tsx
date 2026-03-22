"use client";

import { Clock3, MessageSquarePlus, MessagesSquare } from "lucide-react";
import type { ChatSession } from "@/types";
import { useI18n } from "@/lib/i18n/use-i18n";

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
}: SessionListProps) {
  const { locale, t } = useI18n();

  return (
    <aside className="glass-panel rounded-[30px] p-4">
      <button
        type="button"
        onClick={onCreate}
        className="w-full rounded-[22px] bg-ink px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
      >
        <span className="flex items-center justify-center gap-2">
          <MessageSquarePlus className="h-4 w-4" strokeWidth={2} />
          {t("chat.newSession")}
        </span>
      </button>

      <div className="mt-4 space-y-2">
        {sessions.length === 0 ? (
          <p className="text-xs text-ink/60">{t("chat.noSessions")}</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session.id)}
              className={`w-full rounded-[22px] border px-3 py-3 text-left text-sm transition ${
                activeSessionId === session.id
                  ? "border-ink bg-ink text-white shadow-lg shadow-ink/10"
                  : "border-ink/15 bg-white/82 text-ink hover:-translate-y-0.5 hover:border-brand"
              }`}
            >
              <p className="flex items-center gap-2 truncate font-medium">
                <MessagesSquare className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{session.title}</span>
              </p>
              <p
                className={`mt-1 flex items-center gap-1.5 text-[11px] ${
                  activeSessionId === session.id ? "text-white/80" : "text-ink/55"
                }`}
              >
                <Clock3 className="h-3 w-3" strokeWidth={2} />
                {new Date(session.updatedAt).toLocaleString(locale === "zh" ? "zh-CN" : "en-US")}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
