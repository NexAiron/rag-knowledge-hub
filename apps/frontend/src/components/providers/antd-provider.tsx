"use client";

import { App, ConfigProvider, theme as antdTheme } from "antd";
import type { ReactNode } from "react";
import { useThemeStore } from "@/stores/theme-store";

interface AntdProviderProps {
  children: ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        // Keep Ant Design tokens aligned with the custom blue workspace theme.
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#78AEEB",
          colorInfo: "#78AEEB",
          borderRadius: 18,
          fontFamily: "var(--font-noto-sans-sc), system-ui, sans-serif",
          colorBgBase: isDark ? "#0c1421" : "#f7faff",
          colorTextBase: isDark ? "#e6eef8" : "#1d2433",
        },
        components: {
          Card: {
            borderRadiusLG: 26,
          },
          Button: {
            borderRadius: 16,
            controlHeight: 42,
          },
          Input: {
            borderRadius: 16,
            controlHeight: 44,
          },
          Table: {
            borderRadiusLG: 24,
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
