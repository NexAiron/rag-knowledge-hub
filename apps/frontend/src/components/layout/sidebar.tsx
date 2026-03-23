"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BookOpen, LayoutDashboard, LibraryBig } from "lucide-react";
import { Card, Empty, Spin, Tag, Typography } from "antd";
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
      <div className="dashboard-sidebar h-full">
        <Card
          variant="borderless"
          className="dashboard-sidebar-brand !rounded-[28px] !shadow-none"
          styles={{ body: { padding: 22 } }}
        >
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <Typography.Text className="!text-[10px] !font-semibold !uppercase !tracking-[0.26em] !text-ink/58">
                {t("common.brand")}
              </Typography.Text>
              <Typography.Paragraph className="!mb-0 !mt-1 !text-[11px] !text-ink/48">
                {t("dashboard.title")}
              </Typography.Paragraph>
            </div>
          </div>
          <Typography.Title
            level={3}
            className="!mb-0 !mt-5 !text-[1.5rem] !font-semibold !tracking-[-0.05em] !text-ink"
          >
            {t("sidebar.title")}
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/66">
            {t("sidebar.subtitle")}
          </Typography.Paragraph>
        </Card>

        <div className="mt-6">
          <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/46">
            {t("sidebar.navigation")}
          </Typography.Text>
          <div className="mt-3 space-y-2">
            <Link
              href="/dashboard"
              className={`dashboard-sidebar-link ${selectedKey === "dashboard" ? "is-active" : ""}`}
            >
              <div className="dashboard-sidebar-icon">
                <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <Typography.Text className="!block !text-sm !font-semibold !text-current">
                  {t("sidebar.dashboard")}
                </Typography.Text>
                <Typography.Text className="!block !text-[12px] !text-current/60">
                  {t("sidebar.dashboardHint")}
                </Typography.Text>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between gap-3">
            <Typography.Text className="!flex !items-center !gap-2 !text-[11px] !font-semibold !uppercase !tracking-[0.18em] !text-ink/46">
              <LibraryBig className="h-3.5 w-3.5" strokeWidth={2} />
              {t("sidebar.knowledgeBases")}
            </Typography.Text>
            <Tag variant="filled" className="dashboard-soft-tag !m-0">
              {knowledgeBases.length}
            </Tag>
          </div>

          {isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-ink/60">
              <Spin size="small" />
              <span>{t("sidebar.loading")}</span>
            </div>
          ) : knowledgeBases.length === 0 ? (
            <Card
              variant="borderless"
              className="ambient-card !mt-4 !rounded-[24px] !shadow-none"
            >
              <Empty
                description={t("sidebar.empty")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
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
                    className={`dashboard-sidebar-link ${active ? "is-active" : ""}`}
                  >
                    <div className="dashboard-sidebar-icon">
                      <BookOpen className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography.Text className="!block truncate !text-sm !font-semibold !text-current">
                        {kb.name}
                      </Typography.Text>
                      <Typography.Text className="!block !text-[12px] !text-current/60">
                        {kb.documentCount} {t("sidebar.docs")}
                      </Typography.Text>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
