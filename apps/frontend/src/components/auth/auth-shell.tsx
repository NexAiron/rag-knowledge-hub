"use client";

import type { ReactNode } from "react";
import { Card, Space, Tag, Typography } from "antd";
import type { LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";

interface AuthFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthShellProps {
  badge: string;
  title: string;
  description: string;
  panelEyebrow: string;
  panelTitle: string;
  panelDescription: string;
  features: AuthFeatureItem[];
  form: ReactNode;
  footer: ReactNode;
}

export function AuthShell({
  badge,
  title,
  description,
  panelEyebrow,
  panelTitle,
  panelDescription,
  features,
  form,
  footer,
}: AuthShellProps) {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(120,174,235,0.18),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(84,127,191,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0))]" />

      <Card
        variant="borderless"
        className="relative z-10 w-full max-w-[1080px] !rounded-[32px] border border-white/45 bg-white/52 shadow-[0_40px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
        styles={{ body: { padding: 0 } }}
      >
        <div className="grid min-h-[640px] lg:grid-cols-[1.02fr_0.98fr]">
          <section className="border-b border-ink/8 px-8 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandMark />
                <div>
                  <Typography.Text className="!block !text-[11px] !font-semibold !uppercase !tracking-[0.22em] !text-brand">
                    {t("common.brand")}
                  </Typography.Text>
                  <Typography.Text className="!text-xs !text-ink/55">
                    {t("common.brand")}
                  </Typography.Text>
                </div>
              </div>
              <Space size={8}>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </Space>
            </div>

            <Tag
              color="blue"
              variant="filled"
              className="!mt-10 !rounded-full !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.22em]"
            >
              {badge}
            </Tag>

            <Typography.Title
              level={2}
              className="!mb-0 !mt-5 max-w-[440px] !text-[2.1rem] !font-semibold !tracking-[-0.04em] !text-ink lg:!text-[2.45rem]"
            >
              {title}
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-4 max-w-[520px] !text-[14px] !leading-7 !text-ink/62">
              {description}
            </Typography.Paragraph>

            <div className="mt-8 grid gap-3">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    size="small"
                    variant="borderless"
                    className="ambient-card !rounded-[22px] !shadow-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                      </div>
                      <div>
                        <Typography.Text className="!block !text-sm !font-semibold !text-ink">
                          {item.title}
                        </Typography.Text>
                        <Typography.Paragraph className="!mb-0 !mt-1 !text-[13px] !leading-6 !text-ink/58">
                          {item.description}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="flex items-center px-8 py-8 lg:px-10 lg:py-10">
            <Card
              variant="borderless"
              className="ambient-card w-full !rounded-[28px] !shadow-none"
              styles={{ body: { padding: 28 } }}
            >
              <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.2em] !text-brand">
                {panelEyebrow}
              </Typography.Text>
              <Typography.Title
                level={3}
                className="!mb-0 !mt-3 !text-[1.65rem] !font-semibold !tracking-[-0.03em] !text-ink"
              >
                {panelTitle}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/60">
                {panelDescription}
              </Typography.Paragraph>

              {form}
              {footer}
            </Card>
          </section>
        </div>
      </Card>
    </main>
  );
}
