"use client";

import { Button } from "antd";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useI18n();
  const nextLabel = locale === "zh" ? "EN" : "中";

  return (
    <Button
      onClick={toggleLocale}
      title={locale === "zh" ? t("common.english") : t("common.chinese")}
      aria-label={locale === "zh" ? t("common.english") : t("common.chinese")}
      icon={<Languages className="h-[18px] w-[18px]" strokeWidth={2} />}
      className="dashboard-header-chip !inline-flex !items-center !gap-2 !rounded-full !px-3 !text-ink/72"
    >
      <span className="min-w-[32px] text-center text-[11px] font-semibold uppercase tracking-[0.16em]">
        {nextLabel}
      </span>
    </Button>
  );
}
