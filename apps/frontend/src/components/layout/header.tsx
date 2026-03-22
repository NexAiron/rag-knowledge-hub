"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button, Tag, Typography } from "antd";
import { LogOut, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

interface HeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const { t } = useI18n();

  return (
    <header className="glass-panel overflow-hidden rounded-[32px] p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Tag
            bordered={false}
            color="blue"
            className="m-0 inline-flex min-h-[28px] items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]"
          >
            <Sparkles className="h-3 w-3" strokeWidth={2} />
            {t("header.workspace")}
          </Tag>
          <Typography.Title
            level={1}
            className="!mb-0 !mt-4 min-h-[2.2rem] !text-[1.75rem] !font-semibold !tracking-[-0.04em] !text-ink lg:min-h-[2.7rem] lg:!text-[2.1rem]"
          >
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph className="!mb-0 !mt-3 min-h-[3rem] max-w-2xl !text-[13px] !leading-6 !text-ink/62">
              {description}
            </Typography.Paragraph>
          ) : null}
        </div>

        <div className="flex min-h-[52px] flex-wrap items-center justify-end gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {action}

          {user ? (
            <>
              <div className="ambient-card rounded-[22px] px-4 py-3 text-right">
                <Typography.Text className="!text-[11px] uppercase tracking-[0.18em] !text-ink/45">
                  {t("header.welcome")}
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !mt-1 !text-sm !font-semibold !text-ink">
                  {user.name}
                </Typography.Paragraph>
              </div>
              <Button
                onClick={logout}
                icon={<LogOut className="h-3.5 w-3.5" strokeWidth={2} />}
                className="!rounded-2xl !border-ink/20 !bg-white/78 !px-4 !text-xs !font-semibold !text-ink shadow-none transition hover:!-translate-y-0.5 hover:!border-brand hover:!text-brand"
              >
                {t("common.logout")}
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex"
            >
              <Button type="primary" className="!rounded-2xl !bg-ink !px-4 !text-xs !font-semibold shadow-lg shadow-ink/10">
                {t("common.signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
