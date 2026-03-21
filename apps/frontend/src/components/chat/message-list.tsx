"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types";
import { MessageItem } from "@/components/chat/message-item";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="h-[65vh] min-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-ink/15 bg-panel p-4"
    >
      {messages.length === 0 ? (
        <p className="text-sm text-ink/60">
          Start by asking a question about this knowledge base.
        </p>
      ) : (
        messages.map((message) => <MessageItem key={message.id} message={message} />)
      )}
    </div>
  );
}
