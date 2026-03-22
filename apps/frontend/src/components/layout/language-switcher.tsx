"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/use-i18n";

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      title={locale === "zh" ? t("common.english") : t("common.chinese")}
      aria-label={locale === "zh" ? t("common.english") : t("common.chinese")}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-3 text-ink/72 shadow-sm shadow-brand/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
    >
      <Languages className="h-4.5 w-4.5" strokeWidth={2} />
      <span className="min-w-[32px] text-center text-[11px] font-semibold uppercase tracking-[0.16em]">
        {locale === "zh" ? "EN" : "中"}
      </span>
    </button>
  );
}
