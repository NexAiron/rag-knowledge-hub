"use client";

import type { ChatMessage } from "@/types";
import { MarkdownContent } from "@/components/chat/markdown-content";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const { t } = useI18n();
  const isUser = message.role === "user";
  const isStreaming = message.role === "assistant" && message.status === "streaming";

  return (
    <article
      className={`max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-6 ${
        isUser
          ? "ml-auto border-ink/20 bg-ink text-white shadow-lg shadow-ink/10"
          : "mr-auto border-ink/15 bg-white/88 text-ink"
      }`}
    >
      <p className="mb-1 text-[11px] uppercase tracking-wide opacity-70">
        {isUser ? t("chat.you") : t("chat.assistant")}
      </p>

      {isStreaming && !message.content ? (
        <p className="text-sm text-ink/70">{t("chat.thinking")}</p>
      ) : (
        <MarkdownContent content={message.content || "..."} className="markdown-body" />
      )}
    </article>
  );
}
