"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Tag, Typography } from "antd";
import { MessageSquareText } from "lucide-react";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { SessionList } from "@/components/chat/session-list";
import { SourcePanel } from "@/components/chat/source-panel";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useChatStore } from "@/stores/chat-store";

interface ChatWindowProps {
  kbId: string;
}

export function ChatWindow({ kbId }: ChatWindowProps) {
  const [question, setQuestion] = useState("");
  const { t } = useI18n();

  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const messagesBySession = useChatStore((state) => state.messagesBySession);
  const sourcesBySession = useChatStore((state) => state.sourcesBySession);
  const streamStatus = useChatStore((state) => state.streamStatus);
  const error = useChatStore((state) => state.error);
  const createSession = useChatStore((state) => state.createSession);
  const setActiveSession = useChatStore((state) => state.setActiveSession);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const stopStream = useChatStore((state) => state.stopStream);
  const clearActiveSessionMessages = useChatStore(
    (state) => state.clearActiveSessionMessages,
  );

  useEffect(() => {
    if (sessions.length === 0) {
      createSession(kbId, t("chat.newSession"));
      return;
    }

    const activeSession = sessions.find((session) => session.id === activeSessionId);
    if (!activeSession || activeSession.kbId !== kbId) {
      const firstSessionForKb = sessions.find((session) => session.kbId === kbId);
      if (firstSessionForKb) {
        setActiveSession(firstSessionForKb.id);
      } else {
        createSession(kbId, t("chat.newSession"));
      }
    }
  }, [activeSessionId, createSession, kbId, sessions, setActiveSession, t]);

  const activeMessages = useMemo(
    () => (activeSessionId ? messagesBySession[activeSessionId] ?? [] : []),
    [activeSessionId, messagesBySession],
  );

  const activeSources = useMemo(
    () => (activeSessionId ? sourcesBySession[activeSessionId] ?? [] : []),
    [activeSessionId, sourcesBySession],
  );

  const latestAssistantAnswer = useMemo(() => {
    for (let index = activeMessages.length - 1; index >= 0; index -= 1) {
      const message = activeMessages[index];
      if (message.role === "assistant") return message.content;
    }
    return "";
  }, [activeMessages]);

  const currentSessions = useMemo(
    () => sessions.filter((session) => session.kbId === kbId),
    [kbId, sessions],
  );

  const handleSend = async () => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) return;
    await sendMessage({ kbId, question: normalizedQuestion });
    setQuestion("");
  };

  return (
    <div className="space-y-4">
      <Card
        bordered={false}
        className="dashboard-hero !rounded-[32px] !shadow-none"
      >
        <div className="dashboard-hero-simple">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <Tag bordered={false} className="dashboard-soft-tag !m-0">
                {t("chat.workspaceLabel")}
              </Tag>
              <Typography.Title
                level={2}
                className="!mb-0 !mt-4 !text-[1.8rem] !font-semibold !tracking-[-0.04em] !text-ink"
              >
                {t("chat.pageTitle")}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-7 !text-ink/64">
                {t("chat.workspaceHint")}
              </Typography.Paragraph>
            </div>
            <Tag className="!rounded-full !px-3 !py-1">KB · {kbId}</Tag>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <SessionList
          sessions={currentSessions}
          activeSessionId={activeSessionId}
          onSelect={setActiveSession}
          onCreate={() => createSession(kbId, t("chat.newSession"))}
        />

        <div className="flex min-h-[70vh] flex-col gap-4">
          <Card
            bordered={false}
            className="dashboard-side-panel !rounded-[30px] !shadow-none"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Typography.Text className="!flex !items-center !gap-2 !text-[11px] !font-semibold !uppercase !tracking-[0.24em] !text-brand">
                  <MessageSquareText className="h-4 w-4" strokeWidth={2} />
                  {t("chat.messageLabel")}
                </Typography.Text>
                <Typography.Title
                  level={3}
                  className="!mb-0 !mt-2 !text-xl !font-semibold !tracking-[-0.04em] !text-ink"
                >
                  {t("chat.pageTitle")}
                </Typography.Title>
              </div>
              <Tag className="!rounded-full">
                {t(`chat.sourceStatus.${streamStatus}`)}
              </Tag>
            </div>
          </Card>

          <MessageList messages={activeMessages} />
          <ChatInput
            value={question}
            onChange={setQuestion}
            onSubmit={() => void handleSend()}
            onStop={stopStream}
            onClear={clearActiveSessionMessages}
            isStreaming={streamStatus === "streaming"}
          />
          {error ? (
            <Alert
              message={error}
              type="error"
              showIcon
              className="!rounded-2xl"
            />
          ) : null}
        </div>

        <div className="hidden xl:block">
          <SourcePanel
            status={streamStatus}
            answer={latestAssistantAnswer}
            sources={activeSources}
          />
        </div>
      </section>
    </div>
  );
}
