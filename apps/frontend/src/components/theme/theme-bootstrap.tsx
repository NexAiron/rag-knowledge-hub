"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeBootstrap() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Drive the app-wide light/dark visuals from a single html data attribute.
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
