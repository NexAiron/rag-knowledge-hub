"use client";

import { Empty, Typography } from "antd";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types";
import { MessageItem } from "@/components/chat/message-item";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MessageListProps {
  messages: ChatMessage[];
  selectedMessageId?: string | null;
  onSelectMessage?: (message: ChatMessage) => void;
}

export function MessageList({
  messages,
  selectedMessageId,
  onSelectMessage,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="glass-panel h-[65vh] min-h-[420px] overflow-y-auto rounded-[30px] p-4 lg:p-5"
    >
      {messages.length === 0 ? (
        <div className="flex h-full min-h-[320px] items-center justify-center">
          <Empty
            description={t("chat.empty")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isSelected={message.id === selectedMessageId}
              onSelect={onSelectMessage}
            />
          ))}
        </div>
      )}
      {messages.length > 0 ? (
        <Typography.Text className="!mt-4 !block !text-center !text-[11px] !uppercase !tracking-[0.16em] !text-ink/38">
          {t("chat.clearHint")}
        </Typography.Text>
      ) : null}
    </div>
  );
}
