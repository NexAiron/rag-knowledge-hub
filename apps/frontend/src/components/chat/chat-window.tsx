"use client";

import { useEffect, useMemo, useState } from "react";
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

  const activeMessages = useMemo(() => {
    if (!activeSessionId) return [];
    return messagesBySession[activeSessionId] ?? [];
  }, [activeSessionId, messagesBySession]);

  const activeSources = useMemo(() => {
    if (!activeSessionId) return [];
    return sourcesBySession[activeSessionId] ?? [];
  }, [activeSessionId, sourcesBySession]);

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

    await sendMessage({
      kbId,
      question: normalizedQuestion,
    });
    setQuestion("");
  };

  const handleNewSession = () => {
    createSession(kbId, t("chat.newSession"));
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <SessionList
        sessions={currentSessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSession}
        onCreate={handleNewSession}
      />

      <div className="flex min-h-[70vh] flex-col gap-4">
        <div className="glass-panel rounded-[30px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
                RAG Chat
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-ink">
                {t("chat.pageTitle")}
              </h2>
            </div>
            <div className="rounded-full border border-ink/10 bg-white/78 px-3 py-1.5 text-xs font-medium text-ink/65">
              KB · {kbId}
            </div>
          </div>
        </div>

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
          <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
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
  );
}
