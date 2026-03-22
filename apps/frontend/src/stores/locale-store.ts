"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "zh" | "en";

interface LocaleStoreState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStoreState>()(
  persist(
    (set) => ({
      locale: "zh",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "nexairon-locale",
    },
  ),
);
