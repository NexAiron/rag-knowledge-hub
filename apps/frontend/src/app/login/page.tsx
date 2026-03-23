"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Divider, Form, Input } from "antd";
import { BookOpenText, DatabaseZap, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { DEFAULT_AUTHENTICATED_REDIRECT } from "@/lib/auth/routes";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const storeError = useUserStore((state) => state.error);

  const handleSubmit = async (values: LoginFormValues) => {
    await login({
      email: values.email.trim(),
      password: values.password.trim(),
    });
    router.push(searchParams.get("next") || DEFAULT_AUTHENTICATED_REDIRECT);
  };

  return (
    <AuthShell
      badge={t("login.badge")}
      title={t("login.title")}
      description={t("login.subtitle")}
      panelEyebrow={t("common.signIn")}
      panelTitle={t("login.panelTitle")}
      panelDescription={t("login.panelSubtitle")}
      features={[
        {
          icon: ShieldCheck,
          title: t("login.authLabel"),
          description: t("login.tip1"),
        },
        {
          icon: BookOpenText,
          title: t("login.kbLabel"),
          description: t("login.tip2"),
        },
        {
          icon: DatabaseZap,
          title: t("login.parserLabel"),
          description: t("login.tip3"),
        },
      ]}
      form={
        <>
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
                { required: true, message: t("login.passwordRequired") },
                { min: 6, message: t("login.passwordInvalid") },
              ]}
            >
              <Input.Password
                placeholder={t("login.passwordPlaceholder")}
                size="large"
              />
            </Form.Item>

            <Form.Item className="!mb-0 !mt-7">
              <Button
                htmlType="submit"
                type="primary"
                loading={isLoading}
                block
                size="large"
                className="!h-[48px] !rounded-[18px] !bg-ink !font-semibold shadow-[0_16px_36px_rgba(29,36,51,0.18)]"
              >
                {isLoading ? t("login.submitting") : t("login.submit")}
              </Button>
            </Form.Item>
          </Form>

          {storeError ? (
            <Alert
              className="!mt-4 !rounded-2xl"
              type="error"
              showIcon
              message={storeError}
            />
          ) : null}
        </>
      }
      footer={
        <>
          <Divider className="!my-6" />

          <div className="flex items-center justify-between gap-4 text-sm text-ink/62">
            <span>{t("login.noAccount")}</span>
            <Link
              href="/register"
              className="font-semibold text-brand transition hover:text-ink"
            >
              {t("login.goRegister")}
            </Link>
          </div>
        </>
      }
    />
  );
}
