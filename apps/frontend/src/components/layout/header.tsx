"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { App, Avatar, Button, Dropdown, Tag, Typography } from "antd";
import {
  ChevronDown,
  LogOut,
  Settings2,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  const { message } = App.useApp();
  const router = useRouter();

  const menuItems = useMemo(
    () =>
      user
        ? [
            {
              key: "profile",
              icon: <Settings2 className="h-4 w-4" strokeWidth={2} />,
              label: t("header.editProfile"),
            },
            {
              type: "divider" as const,
            },
            {
              key: "logout",
              icon: <LogOut className="h-4 w-4" strokeWidth={2} />,
              label: t("common.logout"),
            },
          ]
        : [],
    [t, user],
  );

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === "profile") {
      router.push("/profile");
      return;
    }

    if (key === "logout") {
      await logout();
      message.success(t("header.logoutSuccess"));
      router.push("/login");
    }
  };

  return (
    <header className="glass-panel overflow-hidden rounded-[32px] p-5 lg:p-6">
      <div className="dashboard-header-shell">
        <div className="dashboard-header-copy">
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
            className="!mb-0 !mt-4 min-h-[2.2rem] !text-[1.75rem] !font-semibold !tracking-[-0.04em] !text-ink lg:min-h-[2.7rem] lg:!text-[2.05rem]"
          >
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph className="!mb-0 !mt-3 min-h-[3rem] max-w-2xl !text-[13px] !leading-6 !text-ink/62">
              {description}
            </Typography.Paragraph>
          ) : null}
        </div>

        <div className="dashboard-header-actions">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {action}

          {user ? (
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button type="button" className="dashboard-user-nav">
                <Avatar
                  size={30}
                  className="dashboard-user-avatar"
                  icon={<UserCircle2 className="h-4 w-4" strokeWidth={2} />}
                />
                <span className="dashboard-user-name">{user.name}</span>
                <ChevronDown
                  className="h-4 w-4 text-ink/46"
                  strokeWidth={2}
                />
              </button>
            </Dropdown>
          ) : (
            <Link href="/login" className="inline-flex">
              <Button
                type="primary"
                className="dashboard-primary-button !rounded-2xl !px-4 !text-xs !font-semibold shadow-none"
              >
                {t("common.signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
