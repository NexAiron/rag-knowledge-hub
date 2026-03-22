"use client";

import { useI18n } from "@/lib/i18n/use-i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex rounded-full border border-ink/10 bg-white/75 p-1 shadow-sm shadow-brand/5 backdrop-blur">
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "zh" ? "bg-ink text-white" : "text-ink/65 hover:text-ink"
        }`}
      >
        {t("common.chinese")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          locale === "en" ? "bg-ink text-white" : "text-ink/65 hover:text-ink"
        }`}
      >
        {t("common.english")}
      </button>
    </div>
  );
}
