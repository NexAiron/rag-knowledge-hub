"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Form, Input, Space, Tag, Typography } from "antd";
import { BookOpenText, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const register = useUserStore((state) => state.register);
  const isLoading = useUserStore((state) => state.isLoading);
  const storeError = useUserStore((state) => state.error);

  const handleSubmit = async (values: RegisterFormValues) => {
    await register({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    });
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1480px] items-center px-5 py-8 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-[36px] border border-white/45 bg-white/36 shadow-[0_40px_140px_rgba(29,36,51,0.16)] backdrop-blur-2xl xl:grid-cols-[1.02fr_0.98fr]">
        <div className="accent-panel relative overflow-hidden px-7 py-8 text-white lg:px-12 lg:py-12">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrandMark inverted />
                <Tag bordered={false} className="!m-0 !rounded-full !border !border-white/16 !bg-white/10 !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.26em] !text-white/78">
                  {t("register.badge")}
                </Tag>
              </div>
              <Space size={8}>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </Space>
            </div>

            <div className="mt-12 max-w-xl">
              <Typography.Title className="!mb-0 min-h-[7.5rem] !text-[2.45rem] !font-semibold !tracking-[-0.05em] !text-white lg:min-h-[10rem] lg:!text-[3.15rem] lg:!leading-[1.04]">
                {t("register.title")}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-5 min-h-[5.5rem] !text-[14px] !leading-7 !text-white/78 lg:max-w-lg">
                {t("register.subtitle")}
              </Typography.Paragraph>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, index: "01", label: t("register.accountLabel"), desc: t("login.tip1") },
                { icon: BookOpenText, index: "02", label: t("register.knowledgeLabel"), desc: t("login.tip2") },
                { icon: Sparkles, index: "03", label: t("register.pipelineLabel"), desc: t("login.tip3") },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.index}
                    bordered={false}
                    className="!rounded-[26px] !border !border-white/12 !bg-white/10 !shadow-none sm:min-h-[156px]"
                    styles={{ body: { padding: 16, color: "white" } }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/56">{item.index}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-white/88">
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-white/62">{item.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-7 py-8 lg:px-12 lg:py-12">
          <Card bordered={false} className="ambient-card max-w-md !rounded-[30px] !shadow-none" styles={{ body: { padding: 28 } }}>
            <Typography.Title level={2} className="!mb-0 min-h-[2.25rem] !text-[1.55rem] !font-semibold !tracking-[-0.04em] !text-ink">
              {t("register.panelTitle")}
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-3 min-h-[3rem] !text-[13px] !leading-6 !text-ink/64">
              {t("register.panelSubtitle")}
            </Typography.Paragraph>

            <Form<RegisterFormValues>
              layout="vertical"
              className="!mt-8"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label={t("register.name")}
                name="name"
                rules={[{ required: true, message: t("register.nameRequired") }]}
              >
                <Input placeholder={t("register.namePlaceholder")} />
              </Form.Item>

              <Form.Item
                label={t("login.email")}
                name="email"
                rules={[
                  { required: true, message: t("login.emailRequired") },
                  { type: "email", message: t("login.emailInvalid") },
                ]}
              >
                <Input placeholder={t("login.emailPlaceholder")} />
              </Form.Item>

              <Form.Item
                label={t("login.password")}
                name="password"
                rules={[
                  { required: true, message: t("login.emailRequired") },
                  { min: 6, message: t("login.passwordInvalid") },
                ]}
              >
                <Input.Password placeholder={t("login.passwordPlaceholder")} />
              </Form.Item>

              <Form.Item className="!mb-0 !mt-6">
                <Button htmlType="submit" type="primary" loading={isLoading} block className="!h-[52px] !rounded-[22px] !bg-ink !text-sm !font-semibold shadow-[0_20px_50px_rgba(29,36,51,0.18)]">
                  {isLoading ? t("register.submitting") : t("register.submit")}
                </Button>
              </Form.Item>
            </Form>

            {storeError ? <Alert className="!mt-4 !rounded-2xl" type="error" showIcon message={storeError} /> : null}

            <div className="mt-6 flex min-h-[44px] items-center justify-between border-t border-ink/8 pt-4 text-sm text-ink/62">
              <span>{t("register.hasAccount")}</span>
              <Link href="/login" className="font-semibold text-brand transition hover:text-ink">
                {t("register.goLogin")}
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
