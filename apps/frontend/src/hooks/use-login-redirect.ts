"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_AUTHENTICATED_REDIRECT } from "@/lib/auth/routes";

export function useLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectAfterAuth = useCallback(() => {
    router.push(
      searchParams.get("next") || DEFAULT_AUTHENTICATED_REDIRECT,
    );
  }, [router, searchParams]);

  return {
    redirectAfterAuth,
  };
}
