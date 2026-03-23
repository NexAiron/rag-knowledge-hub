"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "antd";
import { Layout } from "@/components/layout/layout";
import { ChatWindow } from "@/components/chat/chat-window";
import { useI18n } from "@/lib/i18n/use-i18n";

export default function KnowledgeBaseChatPage() {
  const params = useParams<{ id: string }>();
  const kbId = params.id;
  const { t } = useI18n();

  return (
    <Layout
      title={t("chat.pageTitle")}
      description={`${t("chat.pageDescription")} · ${kbId}`}
      action={
        <Link href={`/kb/${kbId}`}>
          <Button className="dashboard-secondary-button !rounded-2xl">
            {t("documents.backToKb")}
          </Button>
        </Link>
      }
    >
      <ChatWindow kbId={kbId} />
    </Layout>
  );
}
