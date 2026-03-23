"use client";

import { create } from "zustand";
import { getMessage } from "@/lib/i18n/messages";
import {
  deleteConversation,
  listConversationMessages,
  listConversations,
} from "@/lib/api/conversations";
import { createChatStream } from "@/lib/sse/chat-stream";
import { useLocaleStore } from "@/stores/locale-store";
import type {
  ChatMessage,
  ChatSession,
  SourceChunk,
} from "@/types";

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
  loadSessions: (kbId: string) => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
  createSession: (kbId: string, title?: string) => string;
  setActiveSession: (sessionId: string) => void;
  sendMessage: (payload: SendMessageInput) => Promise<void>;
  stopStream: () => void;
  clearActiveSessionMessages: () => void;
  removeSession: (sessionId: string) => Promise<void>;
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

function isDraftSessionId(sessionId: string) {
  return sessionId.startsWith("session-");
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

  loadSessions: async (kbId) => {
    const sessions = await listConversations(kbId);

    set((state) => ({
      sessions: [
        ...sessions,
        ...state.sessions.filter((session) => session.kbId !== kbId),
      ],
      activeKbId: kbId,
      activeSessionId:
        sessions.find((session) => session.id === state.activeSessionId)?.id ??
        state.activeSessionId,
      error: null,
    }));
  },

  loadMessages: async (sessionId) => {
    const messages = await listConversationMessages(sessionId);
    set((state) => ({
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: messages,
      },
      sourcesBySession: {
        ...state.sourcesBySession,
        [sessionId]:
          messages
            .filter((message) => message.role === "assistant")
            .flatMap((message) => message.sources ?? [])
            .slice(-5) ?? [],
      },
      error: null,
    }));
  },

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
    void get().loadMessages(sessionId);
  },

  sendMessage: async ({ kbId, question }) => {
    if (!question.trim()) return;
    if (get().streamStatus === "streaming") return;

    const provisionalSessionId =
      get().activeSessionId ?? get().createSession(kbId, question);
    let currentSessionId = provisionalSessionId;
    const now = Date.now();
    const userMessage: ChatMessage = {
      id: createId("msg"),
      sessionId: provisionalSessionId,
      role: "user",
      content: question,
      createdAt: now,
      sources: [],
      status: "done",
    };

    const assistantMessageId = createId("msg");
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      sessionId: provisionalSessionId,
      role: "assistant",
      content: "",
      createdAt: now + 1,
      sources: [],
      status: "streaming",
    };

    const existingMessages = get().messagesBySession[provisionalSessionId] ?? [];
    const controller = new AbortController();

    set((state) => ({
      activeSessionId: provisionalSessionId,
      activeKbId: kbId,
      streamStatus: "streaming",
      error: null,
      controller,
      messagesBySession: {
        ...state.messagesBySession,
        [provisionalSessionId]: [...existingMessages, userMessage, assistantMessage],
      },
      sessions: touchSession(state.sessions, provisionalSessionId, (session) => ({
        ...session,
        updatedAt: now,
        title:
          existingMessages.length === 0 ? buildSessionTitle(question) : session.title,
      })),
    }));

    try {
      await createChatStream(
        {
          kbId,
          sessionId: isDraftSessionId(provisionalSessionId)
            ? undefined
            : provisionalSessionId,
          question,
        },
        {
          onSession: (payload) => {
            const session = payload as {
              id?: string;
              kbId?: string;
              title?: string;
              createdAt?: string;
              updatedAt?: string;
            } | null;

            if (!session?.id) return;

            const realSessionId = session.id;
            currentSessionId = realSessionId;
            set((state) => {
              const provisionalMessages =
                state.messagesBySession[provisionalSessionId] ?? [];
              const provisionalSources =
                state.sourcesBySession[provisionalSessionId] ?? [];
              const nextSessions = state.sessions.some(
                (item) => item.id === realSessionId,
              )
                ? touchSession(state.sessions, realSessionId, (item) => ({
                    ...item,
                    title: session.title ?? item.title,
                    kbId: session.kbId ?? item.kbId,
                    updatedAt: session.updatedAt
                      ? new Date(session.updatedAt).getTime()
                      : item.updatedAt,
                  }))
                : [
                    {
                      id: realSessionId,
                      kbId: session.kbId ?? kbId,
                      title: session.title ?? buildSessionTitle(question),
                      createdAt: session.createdAt
                        ? new Date(session.createdAt).getTime()
                        : now,
                      updatedAt: session.updatedAt
                        ? new Date(session.updatedAt).getTime()
                        : now,
                    },
                    ...state.sessions.filter(
                      (item) => item.id !== provisionalSessionId,
                    ),
                  ];

              const nextMessages = provisionalMessages.map((message) => ({
                ...message,
                sessionId: realSessionId,
              }));

              const nextState: Partial<ChatStoreState> = {
                sessions: nextSessions,
                activeSessionId: realSessionId,
                activeKbId: session.kbId ?? kbId,
                messagesBySession: {
                  ...state.messagesBySession,
                  [realSessionId]: nextMessages,
                },
                sourcesBySession: {
                  ...state.sourcesBySession,
                  [realSessionId]: provisionalSources,
                },
              };

              if (realSessionId !== provisionalSessionId) {
                delete nextState.messagesBySession?.[provisionalSessionId];
                delete nextState.sourcesBySession?.[provisionalSessionId];
              }

              return nextState as ChatStoreState;
            });

          },

          onToken: (token) => {
            const targetSessionId = currentSessionId;
            set((state) => ({
              messagesBySession: {
                ...state.messagesBySession,
                [targetSessionId]: (state.messagesBySession[targetSessionId] ?? []).map(
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
            const targetSessionId = currentSessionId;
            const sources = normalizeSources(payload);

            set((state) => ({
              sourcesBySession: {
                ...state.sourcesBySession,
                [targetSessionId]: sources,
              },
              messagesBySession: {
                ...state.messagesBySession,
                [targetSessionId]: (state.messagesBySession[targetSessionId] ?? []).map(
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
            const targetSessionId = currentSessionId;
            set((state) => ({
              streamStatus: "done",
              controller: null,
              messagesBySession: {
                ...state.messagesBySession,
                [targetSessionId]: (state.messagesBySession[targetSessionId] ?? []).map(
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
            if (targetSessionId) {
              void get().loadSessions(kbId);
            }
          },

          onError: (message) => {
            const targetSessionId = currentSessionId;
            set((state) => ({
              streamStatus: "error",
              error: message,
              controller: null,
              messagesBySession: {
                ...state.messagesBySession,
                [targetSessionId]: (state.messagesBySession[targetSessionId] ?? []).map(
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

    const targetSessionId = provisionalSessionId;
      set((state) => ({
        streamStatus: "error",
        controller: null,
        error:
          error instanceof Error ? error.message : "Failed to stream response.",
        messagesBySession: {
          ...state.messagesBySession,
          [targetSessionId]: (state.messagesBySession[targetSessionId] ?? []).map(
            (item) =>
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

  removeSession: async (sessionId) => {
    await deleteConversation(sessionId);
    set((state) => {
      const nextSessions = state.sessions.filter((session) => session.id !== sessionId);
      const nextActiveSessionId =
        state.activeSessionId === sessionId ? nextSessions[0]?.id ?? null : state.activeSessionId;
      const nextMessages = { ...state.messagesBySession };
      const nextSources = { ...state.sourcesBySession };
      delete nextMessages[sessionId];
      delete nextSources[sessionId];

      return {
        sessions: nextSessions,
        activeSessionId: nextActiveSessionId,
        messagesBySession: nextMessages,
        sourcesBySession: nextSources,
      };
    });
  },
}));
