"use client";

import { Button } from "antd";
import { MoonStar, SunMedium } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { t } = useI18n();
  const isDark = theme === "dark";

  return (
    <Button
      onClick={toggleTheme}
      title={isDark ? t("theme.light") : t("theme.dark")}
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
      icon={
        isDark ? (
          <SunMedium className="h-[18px] w-[18px]" strokeWidth={2} />
        ) : (
          <MoonStar className="h-[18px] w-[18px]" strokeWidth={2} />
        )
      }
      className="dashboard-header-chip dashboard-header-chip-icon !inline-flex !items-center !justify-center !rounded-full !p-0 !text-ink/72"
    />
  );
}
