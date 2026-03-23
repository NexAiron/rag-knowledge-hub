"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BookOpen, ChevronRight, LayoutDashboard, LibraryBig } from "lucide-react";
import { Empty, Spin, Tag, Typography } from "antd";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useKbStore } from "@/stores/kb-store";
import { useUserStore } from "@/stores/user-store";
import { BrandMark } from "./brand-mark";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const activeKbId = useKbStore((state) => state.activeKbId);
  const isLoading = useKbStore((state) => state.isLoading);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);
  const user = useUserStore((state) => state.user);
  const hasBootstrapped = useUserStore((state) => state.hasBootstrapped);

  useEffect(() => {
    if (hasBootstrapped && user && knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, hasBootstrapped, knowledgeBases.length, user]);

  const selectedKey = useMemo(() => {
    if (pathname === "/kb" || pathname === "/dashboard") return "dashboard";
    if (activeKbId) return activeKbId;
    const matched = knowledgeBases.find((kb) => pathname.startsWith(`/kb/${kb.id}`));
    return matched?.id;
  }, [activeKbId, knowledgeBases, pathname]);

  return (
    <aside className="hidden w-[280px] shrink-0 xl:block">
      <div className="dashboard-sidebar h-full">
        <div className="flex items-center gap-3 px-1">
          <BrandMark />
          <div className="min-w-0">
            <Typography.Text className="!block !truncate !text-[12px] !font-semibold !tracking-[-0.02em] !text-ink">
              {t("common.brand")}
            </Typography.Text>
            <Typography.Text className="!text-[11px] !text-ink/52">
              {t("sidebar.subtitle")}
            </Typography.Text>
          </div>
        </div>

        <div className="mt-6">
          <div className="mt-3 space-y-2">
            <Link
              href="/kb"
              className={`dashboard-sidebar-link ${selectedKey === "dashboard" ? "is-active" : ""}`}
            >
              <div className="dashboard-sidebar-icon">
                <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <Typography.Text className="!block !text-sm !font-semibold !text-current">
                  {t("sidebar.dashboard")}
                </Typography.Text>
                <Typography.Text className="!block !text-[12px] !text-current/58">
                  {t("sidebar.dashboardHint")}
                </Typography.Text>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-current/40" strokeWidth={2} />
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
            <div className="knowledge-sidebar-empty !mt-4">
              <Empty
                description={t("sidebar.empty")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
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
                    <ChevronRight className="h-4 w-4 shrink-0 text-current/40" strokeWidth={2} />
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
