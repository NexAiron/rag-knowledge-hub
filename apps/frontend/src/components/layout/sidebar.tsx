"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BookOpen, LayoutDashboard, LibraryBig } from "lucide-react";
import { Card, Empty, Menu, Spin, Tag, Typography } from "antd";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";
import { BrandMark } from "./brand-mark";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const activeKbId = useKbStore((state) => state.activeKbId);
  const isLoading = useKbStore((state) => state.isLoading);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, knowledgeBases.length]);

  const selectedKey = useMemo(() => {
    if (pathname === "/dashboard") return "dashboard";
    if (activeKbId) return activeKbId;
    const matched = knowledgeBases.find((kb) => pathname.startsWith(`/kb/${kb.id}`));
    return matched?.id;
  }, [activeKbId, knowledgeBases, pathname]);

  return (
    <aside className="hidden w-[320px] shrink-0 lg:block">
      <Card bordered={false} className="glass-panel h-full !rounded-[32px] !shadow-none">
        <Card
          bordered={false}
          className="accent-panel !rounded-[26px] !shadow-none"
          styles={{ body: { padding: 20, color: "white" } }}
        >
          <div className="flex items-center gap-3">
            <BrandMark inverted />
            <div>
              <Typography.Text className="!text-[10px] !font-semibold !uppercase !tracking-[0.26em] !text-white/70">
                {t("common.brand")}
              </Typography.Text>
              <Typography.Paragraph className="!mb-0 !mt-1 !text-[11px] !text-white/56">
                {t("sidebar.workspaceLabel")}
              </Typography.Paragraph>
            </div>
          </div>
          <Typography.Title level={3} className="!mb-0 !mt-3 !text-[1.45rem] !font-semibold !tracking-[-0.04em] !text-white">
            {t("sidebar.dashboard")}
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-white/74">
            {t("sidebar.caption")}
          </Typography.Paragraph>
        </Card>

        <div className="mt-6">
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            items={[
              {
                key: "dashboard",
                icon: <LayoutDashboard className="h-4 w-4" strokeWidth={2} />,
                label: <Link href="/dashboard">{t("sidebar.dashboard")}</Link>,
              },
            ]}
            className="!border-none !bg-transparent"
          />
        </div>

        <div className="mt-6">
          <Typography.Text className="!flex !items-center !gap-2 !text-xs !font-semibold !uppercase !tracking-[0.18em] !text-ink/55">
            <LibraryBig className="h-3.5 w-3.5" strokeWidth={2} />
            {t("sidebar.knowledgeBases")}
          </Typography.Text>

          {isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-ink/60">
              <Spin size="small" />
              <span>{t("sidebar.loading")}</span>
            </div>
          ) : knowledgeBases.length === 0 ? (
            <Card bordered={false} className="ambient-card !mt-4 !rounded-[22px] !shadow-none">
              <Empty description={t("sidebar.knowledgeBases")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
          ) : (
            <div className="mt-3 space-y-2">
              {knowledgeBases.map((kb) => {
                const active = selectedKey === kb.id;
                return (
                  <Link
                    key={kb.id}
                    href={`/kb/${kb.id}`}
                    onClick={() => selectKnowledgeBase(kb.id)}
                    className="block"
                  >
                    <Card
                      size="small"
                      bordered={false}
                      className={`${active ? "accent-panel text-white" : "ambient-card"} !rounded-[22px] !shadow-none transition`}
                    >
                      <Typography.Text className={`!flex !items-center !gap-2 !font-medium ${active ? "!text-white" : "!text-ink"}`}>
                        <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        <span className="truncate">{kb.name}</span>
                      </Typography.Text>
                      <Tag className="!mt-3 !rounded-full" color={active ? "default" : "blue"}>
                        {kb.documentCount} {t("sidebar.docs")}
                      </Tag>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
}
