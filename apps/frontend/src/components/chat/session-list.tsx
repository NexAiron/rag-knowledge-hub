"use client";

import type { ChatSession } from "@/types";

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
  return (
    <aside className="rounded-2xl border border-ink/15 bg-panel p-4">
      <button
        type="button"
        onClick={onCreate}
        className="w-full rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white"
      >
        + New Chat
      </button>

      <div className="mt-4 space-y-2">
        {sessions.length === 0 ? (
          <p className="text-xs text-ink/60">No sessions yet.</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                activeSessionId === session.id
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white text-ink hover:border-brand"
              }`}
            >
              <p className="truncate font-medium">{session.title}</p>
              <p
                className={`mt-1 text-[11px] ${
                  activeSessionId === session.id ? "text-white/80" : "text-ink/55"
                }`}
              >
                {new Date(session.updatedAt).toLocaleString()}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
