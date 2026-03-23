"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoginRoute } from "@/hooks/use-login-route";
import { useUserStore } from "@/stores/user-store";

export function useProtectedRoute() {
  const pathname = usePathname();
  const { redirectToLogin } = useLoginRoute();
  const user = useUserStore((state) => state.user);
  const hasBootstrapped = useUserStore((state) => state.hasBootstrapped);

  useEffect(() => {
    if (!hasBootstrapped || user) {
      return;
    }

    redirectToLogin(pathname && pathname !== "/" ? pathname : undefined);
  }, [hasBootstrapped, pathname, redirectToLogin, user]);

  return {
    isReady: hasBootstrapped && Boolean(user),
  };
}
