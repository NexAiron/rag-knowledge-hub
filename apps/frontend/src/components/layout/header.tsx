"use client";

import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { App, Avatar, Button, Dropdown, Typography } from "antd";
import {
  ChevronDown,
  LogOut,
  Settings2,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginRoute } from "@/hooks/use-login-route";
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
  const { redirectToLogin } = useLoginRoute();

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
      redirectToLogin();
    }
  };

  return (
    <header className="knowledge-header p-4 lg:p-5">
      <div className="dashboard-header-shell">
        <div className="dashboard-header-copy">
          <Typography.Title
            level={1}
            className="!mb-0 min-h-[2rem] !text-[1.45rem] !font-semibold !tracking-[-0.035em] !text-ink lg:min-h-[2.3rem] lg:!text-[1.7rem]"
          >
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph className="!mb-0 !mt-2 max-w-2xl !text-[13px] !leading-6 !text-ink/60">
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
