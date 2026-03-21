"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useUserStore } from "@/stores/user-store";

interface HeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Header({ title, description, action }: HeaderProps) {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  return (
    <header className="rounded-2xl border border-ink/15 bg-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description ? <p className="mt-1 text-sm text-ink/70">{description}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          {action}

          {user ? (
            <>
              <p className="rounded-lg bg-bg px-3 py-2 text-xs text-ink/80">
                {user.name}
              </p>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-ink/20 px-3 py-2 text-xs font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-ink px-3 py-2 text-xs font-medium text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
