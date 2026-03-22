"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";

export function AuthBootstrap() {
  const hasBootstrapped = useUserStore((state) => state.hasBootstrapped);
  const bootstrap = useUserStore((state) => state.bootstrap);

  useEffect(() => {
    if (!hasBootstrapped) {
      void bootstrap();
    }
  }, [bootstrap, hasBootstrapped]);

  return null;
}
