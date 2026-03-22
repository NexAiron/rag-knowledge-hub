"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Divider, Form, Input, Space, Tag, Typography } from "antd";
import { BookOpenText, DatabaseZap, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const storeError = useUserStore((state) => state.error);

  const handleSubmit = async (values: LoginFormValues) => {
    await login({
      email: values.email.trim(),
      password: values.password.trim(),
    });
    router.push("/dashboard");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(120,174,235,0.18),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(84,127,191,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0))]" />

      <Card
        bordered={false}
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
                  <Typography.Text className="!text-xs !text-ink/55">{t("header.workspace")}</Typography.Text>
                </div>
              </div>
              <Space size={8}>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </Space>
            </div>

            <Tag color="blue" bordered={false} className="!mt-10 !rounded-full !px-3 !py-1 !text-[10px] !font-semibold !uppercase !tracking-[0.22em]">
              {t("login.badge")}
            </Tag>

            <Typography.Title level={2} className="!mb-0 !mt-5 max-w-[440px] !text-[2.1rem] !font-semibold !tracking-[-0.04em] !text-ink lg:!text-[2.6rem]">
              企业级学习资料工作台
            </Typography.Title>
            <Typography.Paragraph className="!mb-0 !mt-4 max-w-[520px] !text-[14px] !leading-7 !text-ink/62">
              面向企业项目场景，统一管理知识库、文档解析与问答检索流程。界面采用更克制的浮层式登录入口，减少无效装饰，强调信息清晰和操作效率。
            </Typography.Paragraph>

            <div className="mt-8 grid gap-3">
              {[
                { icon: ShieldCheck, title: t("login.authLabel"), desc: t("login.tip1") },
                { icon: BookOpenText, title: t("login.kbLabel"), desc: t("login.tip2") },
                { icon: DatabaseZap, title: t("login.parserLabel"), desc: t("login.tip3") },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} size="small" bordered={false} className="ambient-card !rounded-[22px] !shadow-none">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                      </div>
                      <div>
                        <Typography.Text className="!block !text-sm !font-semibold !text-ink">
                          {item.title}
                        </Typography.Text>
                        <Typography.Paragraph className="!mb-0 !mt-1 !text-[13px] !leading-6 !text-ink/58">
                          {item.desc}
                        </Typography.Paragraph>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="flex items-center px-8 py-8 lg:px-10 lg:py-10">
            <Card bordered={false} className="ambient-card w-full !rounded-[28px] !shadow-none" styles={{ body: { padding: 28 } }}>
              <Typography.Text className="!text-[11px] !font-semibold !uppercase !tracking-[0.2em] !text-brand">
                Sign In
              </Typography.Text>
              <Typography.Title level={3} className="!mb-0 !mt-3 !text-[1.65rem] !font-semibold !tracking-[-0.03em] !text-ink">
                {t("login.panelTitle")}
              </Typography.Title>
              <Typography.Paragraph className="!mb-0 !mt-3 !text-[13px] !leading-6 !text-ink/60">
                {t("login.panelSubtitle")}
              </Typography.Paragraph>

              <Form<LoginFormValues>
                layout="vertical"
                className="!mt-8"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  label={t("login.email")}
                  name="email"
                  rules={[
                    { required: true, message: t("login.emailRequired") },
                    { type: "email", message: t("login.emailInvalid") },
                  ]}
                >
                  <Input placeholder={t("login.emailPlaceholder")} size="large" />
                </Form.Item>

                <Form.Item
                  label={t("login.password")}
                  name="password"
                  rules={[
                    { required: true, message: t("login.emailRequired") },
                    { min: 6, message: t("login.passwordInvalid") },
                  ]}
                >
                  <Input.Password placeholder={t("login.passwordPlaceholder")} size="large" />
                </Form.Item>

                <Form.Item className="!mb-0 !mt-7">
                  <Button htmlType="submit" type="primary" loading={isLoading} block size="large" className="!h-[48px] !rounded-[18px] !bg-ink !font-semibold shadow-[0_16px_36px_rgba(29,36,51,0.18)]">
                    {isLoading ? t("login.submitting") : t("login.submit")}
                  </Button>
                </Form.Item>
              </Form>

              {storeError ? <Alert className="!mt-4 !rounded-2xl" type="error" showIcon message={storeError} /> : null}

              <Divider className="!my-6" />

              <div className="flex items-center justify-between gap-4 text-sm text-ink/62">
                <span>{t("login.noAccount")}</span>
                <Link href="/register" className="font-semibold text-brand transition hover:text-ink">
                  {t("login.goRegister")}
                </Link>
              </div>
            </Card>
          </section>
        </div>
      </Card>
    </main>
  );
}
