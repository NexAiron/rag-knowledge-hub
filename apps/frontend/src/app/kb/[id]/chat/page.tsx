"use client";

import { useParams } from "next/navigation";
import { ChatWindow } from "@/components/chat/chat-window";
import { Layout } from "@/components/layout/layout";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function KnowledgeBaseChatPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
  const { t } = useI18n();

  return (
    <Layout
      title={t("chat.pageTitle")}
      description={`${t("chat.pageDescription")} · ${kbId}`}
    >
      <ChatWindow kbId={kbId} />
    </Layout>
  );
}
