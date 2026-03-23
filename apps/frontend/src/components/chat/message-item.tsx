"use client";

import { Card, Tag, Typography } from "antd";
import type { ChatMessage } from "@/types";
import { MarkdownContent } from "@/components/chat/markdown-content";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MessageItemProps {
  message: ChatMessage;
  isSelected?: boolean;
  onSelect?: (message: ChatMessage) => void;
}

export function MessageItem({
  message,
  isSelected = false,
  onSelect,
}: MessageItemProps) {
  const { t } = useI18n();
  const isUser = message.role === "user";
  const isStreaming =
    message.role === "assistant" && message.status === "streaming";
  const citationCount = message.citations.length;
  const canSelect = !isUser && citationCount > 0;

  return (
    <div className={isUser ? "ml-auto max-w-[92%]" : "mr-auto max-w-[92%]"}>
      <Card
        size="small"
        bordered={false}
        hoverable={canSelect}
        onClick={canSelect ? () => onSelect?.(message) : undefined}
        className={`${isUser ? "!bg-ink text-white" : "ambient-card"} !rounded-[22px] !shadow-none ${canSelect ? "cursor-pointer" : ""} ${isSelected ? "!ring-2 !ring-brand/25" : ""}`}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Tag color={isUser ? "default" : "blue"} className="!mb-0 !rounded-full">
            {isUser ? t("chat.you") : t("chat.assistant")}
          </Tag>
          {!isUser && citationCount > 0 ? (
            <Tag className="!mb-0 !rounded-full">
              {t("chat.sources")} {citationCount}
            </Tag>
          ) : null}
        </div>

        {isStreaming && !message.content ? (
          <Typography.Text
            className={`!text-sm ${isUser ? "!text-white/84" : "!text-ink/70"}`}
          >
            {t("chat.thinking")}
          </Typography.Text>
        ) : (
          <MarkdownContent
            content={message.content || "..."}
            className={`markdown-body ${isUser ? "markdown-body-inverse" : ""}`}
          />
        )}
      </Card>
    </div>
  );
}
