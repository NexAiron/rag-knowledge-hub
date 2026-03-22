"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types";
import { MessageItem } from "@/components/chat/message-item";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="glass-panel h-[65vh] min-h-[420px] space-y-3 overflow-y-auto rounded-[30px] p-4 lg:p-5"
    >
      {messages.length === 0 ? (
        <p className="rounded-[24px] border border-ink/8 bg-white/76 px-4 py-4 text-sm text-ink/60">
          {t("chat.empty")}
        </p>
      ) : (
        messages.map((message) => <MessageItem key={message.id} message={message} />)
      )}
    </div>
  );
}
