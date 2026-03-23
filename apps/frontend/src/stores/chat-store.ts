"use client";

import { create } from "zustand";
import { getMessage } from "@/lib/i18n/messages";
import { createChatStream } from "@/lib/sse/chat-stream";
import { useLocaleStore } from "@/stores/locale-store";
import type { ChatMessage, ChatSession, SourceChunk } from "@/types";

type StreamStatus = "idle" | "streaming" | "done" | "error";

interface SendMessageInput {
  kbId: string;
  question: string;
}

interface ChatStoreState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeKbId: string | null;
  messagesBySession: Record<string, ChatMessage[]>;
  sourcesBySession: Record<string, SourceChunk[]>;
  streamStatus: StreamStatus;
  error: string | null;
  controller: AbortController | null;
  createSession: (kbId: string, title?: string) => string;
  setActiveSession: (sessionId: string) => void;
  sendMessage: (payload: SendMessageInput) => Promise<void>;
  stopStream: () => void;
  clearActiveSessionMessages: () => void;
}

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getLocale = () => useLocaleStore.getState().locale;
const t = (key: string) => getMessage(getLocale(), key);

const buildSessionTitle = (question?: string): string => {
  if (!question) return t("chat.newSession");
  return question.length > 32 ? `${question.slice(0, 32)}...` : question;
};

function normalizeSources(payload: unknown): SourceChunk[] {
  if (!Array.isArray(payload)) return [];

  return payload.map((item, index) => {
    const source = item as Record<string, unknown>;
    return {
      id: String(source.id ?? `source-${index}`),
      doc: String(source.doc ?? source.title ?? t("chat.unknownDocument")),
      content: String(source.content ?? source.snippet ?? ""),
      page:
        source.page !== undefined && source.page !== null
          ? String(source.page)
          : undefined,
      title: String(source.title ?? source.doc ?? t("chat.unknownDocument")),
      snippet: String(source.snippet ?? source.content ?? ""),
      score:
        typeof source.score === "number"
          ? source.score
          : Number(source.score ?? Number.NaN),
      uri: source.uri ? String(source.uri) : undefined,
    };
  });
}

function touchSession(
  sessions: ChatSession[],
  targetId: string,
  updater: (session: ChatSession) => ChatSession,
): ChatSession[] {
  const target = sessions.find((session) => session.id === targetId);
  if (!target) return sessions;
  const updated = updater(target);
  return [updated, ...sessions.filter((session) => session.id !== targetId)];
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  activeKbId: null,
  messagesBySession: {},
  sourcesBySession: {},
  streamStatus: "idle",
  error: null,
  controller: null,

  createSession: (kbId, title) => {
    const id = createId("session");
    const now = Date.now();
    const session: ChatSession = {
      id,
      kbId,
      title: buildSessionTitle(title),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: id,
      activeKbId: kbId,
      messagesBySession: {
        ...state.messagesBySession,
        [id]: [],
      },
      sourcesBySession: {
        ...state.sourcesBySession,
        [id]: [],
      },
      error: null,
    }));

    return id;
  },

  setActiveSession: (sessionId) => {
    const target = get().sessions.find((session) => session.id === sessionId);
    set({
      activeSessionId: sessionId,
      activeKbId: target?.kbId ?? get().activeKbId,
      error: null,
    });
  },

  sendMessage: async ({ kbId, question }) => {
    if (!question.trim()) return;
    if (get().streamStatus === "streaming") return;

    let sessionId = get().activeSessionId;
    if (!sessionId) {
      sessionId = get().createSession(kbId, question);
    }

    const now = Date.now();
    const userMessage: ChatMessage = {
      id: createId("msg"),
      sessionId,
      role: "user",
      content: question,
      createdAt: now,
      sources: [],
      status: "done",
    };

    const assistantMessageId = createId("msg");
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      sessionId,
      role: "assistant",
      content: "",
      createdAt: now + 1,
      sources: [],
      status: "streaming",
    };

    const existingMessages = get().messagesBySession[sessionId] ?? [];
    const history = [...existingMessages, userMessage].map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const controller = new AbortController();

    set((state) => ({
      activeSessionId: sessionId,
      activeKbId: kbId,
      streamStatus: "streaming",
      error: null,
      controller,
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: [...existingMessages, userMessage, assistantMessage],
      },
      sessions: touchSession(state.sessions, sessionId, (session) => ({
        ...session,
        kbId,
        updatedAt: now,
        title:
          (existingMessages.length === 0 || session.title === "New Chat") &&
          question.trim()
            ? buildSessionTitle(question)
            : session.title,
      })),
    }));

    try {
      await createChatStream(
        {
          kbId,
          sessionId,
          question,
          history,
        },
        {
          onToken: (token) => {
            set((state) => ({
              messagesBySession: {
                ...state.messagesBySession,
                [sessionId]: (state.messagesBySession[sessionId] ?? []).map(
                  (message) =>
                    message.id === assistantMessageId
                      ? {
                          ...message,
                          content: `${message.content}${token}`,
                          status: "streaming",
                        }
                      : message,
                ),
              },
            }));
          },

          onSources: (payload) => {
            const sources = normalizeSources(payload);

            set((state) => ({
              sourcesBySession: {
                ...state.sourcesBySession,
                [sessionId]: sources,
              },
              messagesBySession: {
                ...state.messagesBySession,
                [sessionId]: (state.messagesBySession[sessionId] ?? []).map(
                  (message) =>
                    message.id === assistantMessageId
                      ? {
                          ...message,
                          sources,
                        }
                      : message,
                ),
              },
            }));
          },

          onDone: () => {
            set((state) => ({
              streamStatus: "done",
              controller: null,
              messagesBySession: {
                ...state.messagesBySession,
                [sessionId]: (state.messagesBySession[sessionId] ?? []).map(
                  (message) =>
                    message.id === assistantMessageId
                      ? {
                          ...message,
                          status: "done",
                        }
                      : message,
                ),
              },
            }));
          },

          onError: (message) => {
            set((state) => ({
              streamStatus: "error",
              error: message,
              controller: null,
              messagesBySession: {
                ...state.messagesBySession,
                [sessionId]: (state.messagesBySession[sessionId] ?? []).map(
                  (item) =>
                    item.id === assistantMessageId
                      ? {
                          ...item,
                          status: "error",
                        }
                      : item,
                ),
              },
            }));
          },
        },
        controller.signal,
      );
    } catch (error) {
      if (controller.signal.aborted) {
        set({ streamStatus: "idle", controller: null });
        return;
      }

      set((state) => ({
        streamStatus: "error",
        controller: null,
          error:
          error instanceof Error ? error.message : "Failed to stream response.",
        messagesBySession: {
          ...state.messagesBySession,
          [sessionId]: (state.messagesBySession[sessionId] ?? []).map((item) =>
            item.id === assistantMessageId ? { ...item, status: "error" } : item,
          ),
        },
      }));
    }
  },

  stopStream: () => {
    get().controller?.abort();

    const sessionId = get().activeSessionId;
    if (!sessionId) {
      set({ streamStatus: "idle", controller: null });
      return;
    }

    set((state) => ({
      streamStatus: "idle",
      controller: null,
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: (state.messagesBySession[sessionId] ?? []).map((message) =>
          message.status === "streaming" ? { ...message, status: "error" } : message,
        ),
      },
    }));
  },

  clearActiveSessionMessages: () => {
    const sessionId = get().activeSessionId;
    if (!sessionId) return;

    get().controller?.abort();
    set((state) => ({
      streamStatus: "idle",
      controller: null,
      error: null,
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: [],
      },
      sourcesBySession: {
        ...state.sourcesBySession,
        [sessionId]: [],
      },
    }));
  },
}));
