"use client";

import { getMessage } from "@/lib/i18n/messages";
import { useLocaleStore } from "@/stores/locale-store";

export function useI18n() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  return {
    locale,
    setLocale,
    t: (key: string) => getMessage(locale, key),
  };
}
