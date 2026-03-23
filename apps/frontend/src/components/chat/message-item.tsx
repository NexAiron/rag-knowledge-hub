"use client";

import { Card, Tag, Typography } from "antd";
import type { ChatMessage } from "@/types";
import { MarkdownContent } from "@/components/chat/markdown-content";
import { useI18n } from "@/lib/i18n/use-i18n";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const { t } = useI18n();
  const isUser = message.role === "user";
  const isStreaming =
    message.role === "assistant" && message.status === "streaming";

  return (
    <div className={isUser ? "ml-auto max-w-[92%]" : "mr-auto max-w-[92%]"}>
      <Card
        size="small"
        bordered={false}
        className={`${isUser ? "!bg-ink text-white" : "ambient-card"} !rounded-[22px] !shadow-none`}
      >
        <Tag color={isUser ? "default" : "blue"} className="!mb-3 !rounded-full">
          {isUser ? t("chat.you") : t("chat.assistant")}
        </Tag>

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
