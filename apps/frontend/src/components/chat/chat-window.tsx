"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Alert, App, Button, Card, Tag, Typography } from "antd";
import { FileStack, MessageSquareText } from "lucide-react";
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
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [selectedAssistantMessageId, setSelectedAssistantMessageId] = useState<string | null>(null);
  const { t } = useI18n();
  const { message } = App.useApp();

  const sessions = useChatStore((state) => state.sessions);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const messagesBySession = useChatStore((state) => state.messagesBySession);
  const citationsBySession = useChatStore((state) => state.citationsBySession);
  const streamStatus = useChatStore((state) => state.streamStatus);
  const error = useChatStore((state) => state.error);
  const loadSessions = useChatStore((state) => state.loadSessions);
  const loadMessages = useChatStore((state) => state.loadMessages);
  const createSession = useChatStore((state) => state.createSession);
  const setActiveSession = useChatStore((state) => state.setActiveSession);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const stopStream = useChatStore((state) => state.stopStream);
  const clearActiveSessionMessages = useChatStore(
    (state) => state.clearActiveSessionMessages,
  );
  const removeSession = useChatStore((state) => state.removeSession);

  useEffect(() => {
    void loadSessions(kbId);
  }, [kbId, loadSessions]);

  useEffect(() => {
    const activeSession = sessions.find((session) => session.id === activeSessionId);
    if (activeSession && activeSession.kbId === kbId) {
      void loadMessages(activeSession.id);
      return;
    }

    const firstSessionForKb = sessions.find((session) => session.kbId === kbId);
    if (firstSessionForKb) {
      setActiveSession(firstSessionForKb.id);
    }
  }, [activeSessionId, kbId, loadMessages, sessions, setActiveSession]);

  const activeMessages = useMemo(
    () => (activeSessionId ? messagesBySession[activeSessionId] ?? [] : []),
    [activeSessionId, messagesBySession],
  );

  const activeCitations = useMemo(
    () => (activeSessionId ? citationsBySession[activeSessionId] ?? [] : []),
    [activeSessionId, citationsBySession],
  );

  const selectedAssistantMessage = useMemo(
    () =>
      selectedAssistantMessageId
        ? activeMessages.find(
            (item) =>
              item.id === selectedAssistantMessageId && item.role === "assistant",
          ) ?? null
        : null,
    [activeMessages, selectedAssistantMessageId],
  );

  const latestAssistantAnswer = useMemo(() => {
    for (let index = activeMessages.length - 1; index >= 0; index -= 1) {
      const message = activeMessages[index];
      if (message.role === "assistant") return message.content;
    }
    return "";
  }, [activeMessages]);

  const displayAnswer = selectedAssistantMessage?.content ?? latestAssistantAnswer;
  const displayCitations = selectedAssistantMessage?.citations ?? activeCitations;

  const currentSessions = useMemo(
    () => sessions.filter((session) => session.kbId === kbId),
    [kbId, sessions],
  );

  useEffect(() => {
    setSelectedAssistantMessageId(null);
  }, [activeSessionId]);

  useEffect(() => {
    if (!selectedAssistantMessageId) return;

    const stillExists = activeMessages.some(
      (item) => item.id === selectedAssistantMessageId && item.role === "assistant",
    );

    if (!stillExists) {
      setSelectedAssistantMessageId(null);
    }
  }, [activeMessages, selectedAssistantMessageId]);

  const handleSend = async () => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) return;
    await sendMessage({ kbId, question: normalizedQuestion });
    setQuestion("");
  };

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSessionId(sessionId);
    try {
      await removeSession(sessionId);
      message.success(t("chat.deleteSessionSuccess"));
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : t("chat.deleteSessionFailed"),
      );
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleSelectMessage = (selectedMessage: (typeof activeMessages)[number]) => {
    if (
      selectedMessage.role !== "assistant" ||
      selectedMessage.citations.length === 0
    ) {
      return;
    }

    setSelectedAssistantMessageId(selectedMessage.id);
  };

  return (
    <div className="space-y-4">
      <Card
        variant="borderless"
        className="dashboard-side-panel !rounded-[28px] !shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <Typography.Text className="!flex !items-center !gap-2 !text-[11px] !font-semibold !uppercase !tracking-[0.22em] !text-brand">
              <MessageSquareText className="h-4 w-4" strokeWidth={2} />
              {t("chat.pageTitle")}
            </Typography.Text>
            <Typography.Title
              level={3}
              className="!mb-0 !mt-2 !text-[1.45rem] !font-semibold !tracking-[-0.04em] !text-ink"
            >
              {t("chat.pageTitle")}
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-2 !text-[13px] !leading-6 !text-ink/64">
              {t("chat.pageDescription")}
            </Typography.Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="!rounded-full !px-3 !py-1">KB</Tag>
            <Link href={`/kb/${kbId}/documents`}>
              <Button
                icon={<FileStack className="h-4 w-4" strokeWidth={2} />}
                className="dashboard-secondary-button !rounded-2xl"
              >
                {t("chat.quickDocs")}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <div className="xl:sticky xl:top-4 xl:self-start">
          <SessionList
            sessions={currentSessions}
            activeSessionId={activeSessionId}
            onSelect={setActiveSession}
            onCreate={() => createSession(kbId, t("chat.newSession"))}
            onDelete={(sessionId) => void handleDeleteSession(sessionId)}
            deletingSessionId={deletingSessionId}
          />
        </div>

        <div className="flex min-h-[70vh] flex-col gap-4">
          <Card
            variant="borderless"
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
                  {t("chat.relatedAnswer")}
                </Typography.Title>
              </div>
              <Tag className="!rounded-full">
                {t(`chat.sourceStatus.${streamStatus}`)}
              </Tag>
            </div>
          </Card>

          <MessageList
            messages={activeMessages}
            selectedMessageId={selectedAssistantMessageId}
            onSelectMessage={handleSelectMessage}
          />
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

          <div className="xl:hidden">
            <SourcePanel
              status={streamStatus}
              answer={displayAnswer}
              sources={displayCitations}
            />
          </div>
        </div>

        <div className="hidden xl:block xl:sticky xl:top-4 xl:self-start">
          <SourcePanel
            status={streamStatus}
            answer={displayAnswer}
            sources={displayCitations}
          />
        </div>
      </section>
    </div>
  );
}
