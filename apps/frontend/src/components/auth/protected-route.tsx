"use client";

import { ReactNode } from "react";
import { useProtectedRoute } from "@/hooks/use-protected-route";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isReady } = useProtectedRoute();

  if (!isReady) {
    return null;
  }

  return children;
}
