"use client";

import type { KeyboardEvent } from "react";
import { Button, Card, Input, Space, Typography } from "antd";
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
    <Card
      variant="borderless"
      className="dashboard-side-panel !rounded-[30px] !shadow-none"
    >
      <Input.TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chat.askPlaceholder")}
        autoSize={{ minRows: 3, maxRows: 7 }}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Typography.Text className="!text-xs !text-ink/54">
          {t("chat.inputHint")}
        </Typography.Text>
        <Space wrap>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={isStreaming}
            className="dashboard-primary-button !rounded-2xl shadow-none"
          >
            {isStreaming ? t("chat.generating") : t("chat.send")}
          </Button>
          <Button
            onClick={onStop}
            className="dashboard-secondary-button !rounded-2xl"
          >
            {t("chat.stop")}
          </Button>
          <Button
            onClick={onClear}
            className="dashboard-secondary-button !rounded-2xl"
          >
            {t("chat.clear")}
          </Button>
        </Space>
      </div>
    </Card>
  );
}
