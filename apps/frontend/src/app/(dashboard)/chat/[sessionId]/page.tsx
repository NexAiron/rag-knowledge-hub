"use client";

import { useEffect, useRef, useState } from "react";
import { createChatStream } from "@/lib/sse/chat-stream";

interface Props {
  params: { sessionId: string };
}

export default function ChatSessionPage({ params }: Props) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle");
  const streamRef = useRef<EventSource | null>(null);

  useEffect(() => {
    setAnswer("");
    setStatus("streaming");

    const baseUrl = process.env.NEXT_PUBLIC_SSE_BASE_URL;
    const question = encodeURIComponent("请总结知识库核心内容");
    const url = `${baseUrl}/chat/sessions/${params.sessionId}/stream?question=${question}`;

    streamRef.current = createChatStream(url, {
      onMessage: (token) => setAnswer((prev) => prev + token),
      onDone: () => setStatus("done"),
      onError: () => setStatus("error"),
    });

    return () => {
      streamRef.current?.close();
      streamRef.current = null;
    };
  }, [params.sessionId]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">SSE 流式问答</h2>
      <p className="text-xs text-ink/70">Session: {params.sessionId}</p>
      <div className="rounded-xl border border-ink/20 bg-panel p-5">
        <p className="mb-2 text-xs uppercase tracking-wide text-ink/65">
          status: {status}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-6">
          {answer || "等待服务端流式响应..."}
        </p>
      </div>
    </section>
  );
}

