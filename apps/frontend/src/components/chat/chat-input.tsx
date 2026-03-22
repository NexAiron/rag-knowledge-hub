"use client";

import type { KeyboardEvent } from "react";
import { Button, Card, Input, Space } from "antd";
import { useI18n } from "@/lib/i18n/use-i18n";

interface ChatInputProps {
  value: string;
  isStreaming: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function ChatInput({
  value,
  isStreaming,
  onChange,
  onSubmit,
  onStop,
  onClear,
}: ChatInputProps) {
  const { t } = useI18n();

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Card bordered={false} className="glass-panel !rounded-[30px] !shadow-none">
      <Input.TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chat.askPlaceholder")}
        autoSize={{ minRows: 5, maxRows: 8 }}
      />

      <Space className="!mt-3" wrap>
        <Button type="primary" onClick={onSubmit} loading={isStreaming} className="!rounded-2xl !bg-ink shadow-lg shadow-ink/10">
          {isStreaming ? t("chat.generating") : t("chat.send")}
        </Button>
        <Button onClick={onStop} className="!rounded-2xl">
          {t("chat.stop")}
        </Button>
        <Button onClick={onClear} className="!rounded-2xl">
          {t("chat.clear")}
        </Button>
      </Space>
    </Card>
  );
}
