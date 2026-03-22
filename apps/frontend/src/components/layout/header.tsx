"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";
import { LanguageSwitcher } from "./language-switcher";

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
          <p className="inline-flex rounded-full border border-brand/15 bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
            {t("header.workspace")}
          </p>
          <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-ink lg:text-[2.45rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/68">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageSwitcher />
          {action}

          {user ? (
            <>
              <div className="ambient-card rounded-[22px] px-4 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                  {t("header.welcome")}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{user.name}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-xs font-semibold text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
              >
                {t("common.logout")}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 transition hover:-translate-y-0.5"
            >
              {t("common.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
