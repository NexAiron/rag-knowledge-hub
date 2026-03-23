"use client";

import { Clock3, MessageSquarePlus, MessagesSquare } from "lucide-react";
import { Button, Card, Empty, Tag, Typography } from "antd";
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
    <Card
      variant="borderless"
      className="dashboard-side-panel !rounded-[30px] !shadow-none"
    >
      <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/48">
        {t("chat.sessionLabel")}
      </Typography.Text>
      <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/62">
        {t("chat.sessionHint")}
      </Typography.Paragraph>

      <Button
        type="primary"
        onClick={onCreate}
        block
        icon={<MessageSquarePlus className="h-4 w-4" strokeWidth={2} />}
        className="dashboard-primary-button !mt-5 !rounded-[22px] !text-sm !font-semibold shadow-none"
      >
        {t("chat.newSession")}
      </Button>

      {sessions.length === 0 ? (
        <div className="mt-5">
          <Empty
            description={t("chat.noSessions")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {sessions.map((session) => {
            const active = activeSessionId === session.id;
            return (
              <div key={session.id} className="py-1">
                <Card
                  size="small"
                  hoverable
                  onClick={() => onSelect(session.id)}
                  variant="borderless"
                  className={`w-full !rounded-[22px] !shadow-none ${
                    active ? "!bg-ink text-white" : "ambient-card"
                  }`}
                >
                  <Typography.Text
                    className={`!flex !items-center !gap-2 !font-medium ${
                      active ? "!text-white" : "!text-ink"
                    }`}
                  >
                    <MessagesSquare
                      className="h-3.5 w-3.5 shrink-0"
                      strokeWidth={2}
                    />
                    <span className="truncate">{session.title}</span>
                  </Typography.Text>
                  <Tag
                    className="!mt-3 !rounded-full"
                    color={active ? "default" : "blue"}
                  >
                    <Clock3 className="mr-1 inline h-3 w-3" strokeWidth={2} />
                    {new Date(session.updatedAt).toLocaleString(
                      locale === "zh" ? "zh-CN" : "en-US",
                    )}
                  </Tag>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
