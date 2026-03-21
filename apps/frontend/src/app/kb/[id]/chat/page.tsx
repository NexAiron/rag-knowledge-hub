"use client";

import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/chat/chat-window";
import { Layout } from "@/components/layout/layout";

export default function KnowledgeBaseChatPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;

  return (
    <Layout
      title="Knowledge Base Chat"
      description={`KB ID: ${kbId}. Streaming response via POST /api/chat.`}
    >
      <ChatWindow kbId={kbId} />
    </Layout>
  );
}
