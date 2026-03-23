"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { useUserStore } from "@/stores/user-store";

export function AuthBootstrap() {
  const pathname = usePathname();
  const hasBootstrapped = useUserStore((state) => state.hasBootstrapped);
  const bootstrap = useUserStore((state) => state.bootstrap);

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number])) {
      return;
    }

    if (!hasBootstrapped) {
      void bootstrap();
    }
  }, [bootstrap, hasBootstrapped, pathname]);

  return null;
}
