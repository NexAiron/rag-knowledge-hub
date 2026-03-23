"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function useLoginRoute() {
  const router = useRouter();

  const redirectToLogin = useCallback(
    (nextPath?: string) => {
      const target = nextPath
        ? `/login?next=${encodeURIComponent(nextPath)}`
        : "/login";

      router.replace(target);
      router.refresh();
    },
    [router],
  );

  return {
    redirectToLogin,
  };
}
